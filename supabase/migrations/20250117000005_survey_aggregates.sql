-- Aggregate function for survey deployment statistics
-- This ensures individual responses can NEVER be accessed directly
-- Only aggregate statistics (counts, averages) are exposed

CREATE OR REPLACE FUNCTION get_deployment_aggregate_stats(deployment_id_param UUID)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_responses', COUNT(*),
    'response_rate', CASE
      WHEN (SELECT COUNT(*) FROM organization_memberships om
            JOIN survey_deployments sd ON sd.organization_id = om.organization_id
            WHERE sd.id = deployment_id_param AND om.is_active = true) > 0
      THEN ROUND(
        COUNT(*)::NUMERIC / (
          SELECT COUNT(*)
          FROM organization_memberships om
          JOIN survey_deployments sd ON sd.organization_id = om.organization_id
          WHERE sd.id = deployment_id_param AND om.is_active = true
        )::NUMERIC * 100,
        2
      )
      ELSE 0
    END,
    'submitted_at_min', MIN(created_at),
    'submitted_at_max', MAX(created_at)
  )
  FROM survey_responses
  WHERE deployment_id = deployment_id_param;
$$;

-- Function to get aggregate scores for a specific metric across a deployment
CREATE OR REPLACE FUNCTION get_metric_aggregate(
  deployment_id_param UUID,
  metric_key TEXT
)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH metric_values AS (
    SELECT (scores->>metric_key)::NUMERIC AS value
    FROM survey_responses
    WHERE deployment_id = deployment_id_param
    AND scores ? metric_key
    AND (scores->>metric_key) IS NOT NULL
  )
  SELECT CASE
    WHEN COUNT(*) >= 3 THEN json_build_object(
      'count', COUNT(*),
      'avg', ROUND(AVG(value)::NUMERIC, 2),
      'min', MIN(value),
      'max', MAX(value),
      'median', PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value)
    )
    ELSE json_build_object(
      'count', COUNT(*),
      'error', 'Minimum 3 responses required for privacy'
    )
  END
  FROM metric_values;
$$;

-- Function to get all aggregate metrics for a deployment
CREATE OR REPLACE FUNCTION get_all_deployment_metrics(deployment_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_count INTEGER;
  metric_keys TEXT[];
  metric_key TEXT;
  result JSON;
  metrics_json JSON = '{}'::JSON;
BEGIN
  -- Check response count first
  SELECT COUNT(*) INTO response_count
  FROM survey_responses
  WHERE deployment_id = deployment_id_param;

  -- If less than 3 responses, return privacy message
  IF response_count < 3 THEN
    RETURN json_build_object(
      'total_responses', response_count,
      'error', 'Minimum 3 responses required to view aggregate statistics'
    );
  END IF;

  -- Get all unique score keys from responses
  SELECT ARRAY_AGG(DISTINCT jsonb_object_keys(scores))
  INTO metric_keys
  FROM survey_responses
  WHERE deployment_id = deployment_id_param;

  -- Build metrics object
  SELECT json_object_agg(key, get_metric_aggregate(deployment_id_param, key))
  INTO metrics_json
  FROM unnest(metric_keys) AS key;

  -- Return combined result
  RETURN json_build_object(
    'total_responses', response_count,
    'metrics', metrics_json
  );
END;
$$;

-- Function to get time-series data for repeated deployments of the same survey
-- This enables tracking wellbeing trends over time
CREATE OR REPLACE FUNCTION get_survey_time_series(
  organization_id_param UUID,
  survey_id_param UUID
)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH deployment_stats AS (
    SELECT
      sd.id AS deployment_id,
      sd.title,
      sd.created_at,
      sd.closes_at,
      COUNT(sr.id) AS response_count,
      json_object_agg(
        score_key,
        CASE
          WHEN COUNT(sr.id) >= 3 THEN
            ROUND(AVG((sr.scores->>score_key)::NUMERIC), 2)
          ELSE NULL
        END
      ) FILTER (WHERE score_key IS NOT NULL) AS avg_scores
    FROM survey_deployments sd
    LEFT JOIN survey_responses sr ON sr.deployment_id = sd.id
    CROSS JOIN LATERAL jsonb_object_keys(sr.scores) AS score_key
    WHERE sd.organization_id = organization_id_param
    AND sd.survey_id = survey_id_param
    GROUP BY sd.id, sd.title, sd.created_at, sd.closes_at
    ORDER BY sd.created_at
  )
  SELECT json_agg(
    json_build_object(
      'deployment_id', deployment_id,
      'title', title,
      'created_at', created_at,
      'closes_at', closes_at,
      'response_count', response_count,
      'avg_scores', avg_scores
    )
  )
  FROM deployment_stats
  WHERE response_count >= 3;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_deployment_aggregate_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_metric_aggregate(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_deployment_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_survey_time_series(UUID, UUID) TO authenticated;
