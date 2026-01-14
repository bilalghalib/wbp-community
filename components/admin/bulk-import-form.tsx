'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type ParsedRow = {
  org_name: string
  org_slug: string
  admin_email: string
  admin_name: string
  website: string
  status: 'ready' | 'warning' | 'error'
  statusMessage?: string
}

type ImportResult = {
  success: boolean
  org_name: string
  message: string
}

export default function BulkImportForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload')
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [progress, setProgress] = useState(0)

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV must have a header row and at least one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['org_name', 'admin_email', 'admin_name']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`)
    }

    const nameIdx = headers.indexOf('org_name')
    const slugIdx = headers.indexOf('org_slug')
    const emailIdx = headers.indexOf('admin_email')
    const adminNameIdx = headers.indexOf('admin_name')
    const websiteIdx = headers.indexOf('website')

    const rows: ParsedRow[] = []
    const seenSlugs = new Set<string>()
    const seenEmails = new Set<string>()

    for (let i = 1; i < lines.length; i++) {
      // Handle CSV with quoted fields
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const org_name = values[nameIdx] || ''
      const org_slug = values[slugIdx] || generateSlug(org_name)
      const admin_email = (values[emailIdx] || '').toLowerCase()
      const admin_name = values[adminNameIdx] || ''
      const website = values[websiteIdx] || ''

      let status: 'ready' | 'warning' | 'error' = 'ready'
      let statusMessage = ''

      // Validation
      if (!org_name) {
        status = 'error'
        statusMessage = 'Organization name is required'
      } else if (!admin_email) {
        status = 'error'
        statusMessage = 'Admin email is required'
      } else if (!admin_name) {
        status = 'error'
        statusMessage = 'Admin name is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin_email)) {
        status = 'error'
        statusMessage = 'Invalid email format'
      } else if (seenSlugs.has(org_slug)) {
        status = 'error'
        statusMessage = 'Duplicate slug in CSV'
      } else if (seenEmails.has(admin_email)) {
        status = 'warning'
        statusMessage = 'Same admin email appears multiple times'
      }

      seenSlugs.add(org_slug)
      seenEmails.add(admin_email)

      rows.push({
        org_name,
        org_slug,
        admin_email,
        admin_name,
        website,
        status,
        statusMessage,
      })
    }

    return rows
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const data = parseCSV(text)
        setParsedData(data)
        setStep('preview')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV')
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    const validRows = parsedData.filter(row => row.status !== 'error')
    if (validRows.length === 0) {
      setError('No valid rows to import')
      return
    }

    setStep('importing')
    setProgress(0)
    const results: ImportResult[] = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]

      try {
        const res = await fetch('/api/admin/organizations/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            org_name: row.org_name,
            org_slug: row.org_slug,
            admin_email: row.admin_email,
            admin_name: row.admin_name,
            website: row.website,
          }),
        })

        const data = await res.json()

        results.push({
          success: res.ok,
          org_name: row.org_name,
          message: res.ok ? 'Created successfully' : (data.error || 'Failed'),
        })
      } catch (err) {
        results.push({
          success: false,
          org_name: row.org_name,
          message: 'Network error',
        })
      }

      setProgress(Math.round(((i + 1) / validRows.length) * 100))
      setImportResults([...results])
    }

    setStep('complete')
  }

  const readyCount = parsedData.filter(r => r.status === 'ready').length
  const warningCount = parsedData.filter(r => r.status === 'warning').length
  const errorCount = parsedData.filter(r => r.status === 'error').length

  if (step === 'upload') {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900">
              Click to upload CSV file
            </p>
            <p className="mt-2 text-sm text-gray-500">
              or drag and drop
            </p>
          </div>

          <a
            href="/templates/organizations-import-template.csv"
            download
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            Download template CSV
          </a>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Preview Import</h2>
            <p className="text-sm text-gray-500 mt-1">
              {readyCount} ready • {warningCount} warnings • {errorCount} errors
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep('upload')
                setParsedData([])
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={readyCount + warningCount === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {readyCount + warningCount} Organizations
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedData.map((row, idx) => (
                <tr key={idx} className={row.status === 'error' ? 'bg-red-50' : row.status === 'warning' ? 'bg-yellow-50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.status === 'ready' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Ready
                      </span>
                    )}
                    {row.status === 'warning' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800" title={row.statusMessage}>
                        Warning
                      </span>
                    )}
                    {row.status === 'error' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800" title={row.statusMessage}>
                        Error
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.org_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{row.org_slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.admin_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.admin_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errorCount > 0 && (
          <div className="px-6 py-4 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-800">
              {errorCount} row(s) have errors and will be skipped. Hover over the status badge to see details.
            </p>
          </div>
        )}
      </div>
    )
  }

  if (step === 'importing') {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Importing... {progress}%
            </p>
          </div>

          {importResults.length > 0 && (
            <div className="mt-4 text-left max-h-60 overflow-y-auto">
              {importResults.map((result, idx) => (
                <div key={idx} className={`py-2 px-3 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.success ? '✓' : '✗'} {result.org_name}: {result.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Complete step
  const successCount = importResults.filter(r => r.success).length
  const failCount = importResults.filter(r => !r.success).length

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${successCount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          {successCount > 0 ? (
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className="mt-4 text-xl font-semibold text-gray-900">Import Complete</h2>
        <p className="mt-2 text-gray-600">
          {successCount} organization(s) created successfully
          {failCount > 0 && `, ${failCount} failed`}
        </p>

        {failCount > 0 && (
          <div className="mt-4 text-left max-h-40 overflow-y-auto bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">Failed imports:</p>
            {importResults.filter(r => !r.success).map((result, idx) => (
              <p key={idx} className="text-sm text-red-700">
                • {result.org_name}: {result.message}
              </p>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setStep('upload')
              setParsedData([])
              setImportResults([])
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Import More
          </button>
          <button
            onClick={() => router.push('/admin/organizations')}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Organizations
          </button>
        </div>
      </div>
    </div>
  )
}
