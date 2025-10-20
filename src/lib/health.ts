/**
 * 🏥 Health Check System - Vantage Lane 2.0
 * Provides system health monitoring for development and production
 */

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: Array<{
    name: string
    status: 'healthy' | 'degraded' | 'unhealthy'
    duration?: number
    error?: string
  }>
}

interface LivenessResult {
  status: 'ok' | 'error'
  timestamp: string
}

/**
 * Performs a comprehensive health check of the system
 * Checks various system components and dependencies
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now()
  const checks: HealthCheckResult['checks'] = []
  
  try {
    // Basic system checks for development phase
    
    // 1. Memory usage check
    const memCheck = await checkMemoryUsage()
    checks.push(memCheck)
    
    // 2. File system access check
    const fsCheck = await checkFileSystemAccess()
    checks.push(fsCheck)
    
    // 3. Environment variables check
    const envCheck = await checkEnvironmentVariables()
    checks.push(envCheck)
    
    // 4. Configuration files check
    const configCheck = await checkConfigurationFiles()
    checks.push(configCheck)
    
    // Determine overall status
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy')
    const hasDegraded = checks.some(check => check.status === 'degraded')
    
    const overallStatus = hasUnhealthy ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy'
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: [
        {
          name: 'health_check_system',
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      ]
    }
  }
}

/**
 * Quick liveness check for load balancers and monitoring
 * Returns basic application status without detailed checks
 */
export async function livenessCheck(): Promise<LivenessResult> {
  try {
    // Basic liveness indicators
    const isProcessRunning = process.pid > 0
    const hasMemory = process.memoryUsage().heapUsed > 0
    const isEventLoopActive = Date.now() > 0
    
    const isAlive = isProcessRunning && hasMemory && isEventLoopActive
    
    return {
      status: isAlive ? 'ok' : 'error',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString()
    }
  }
}

// Internal health check functions

async function checkMemoryUsage() {
  const startTime = Date.now()
  
  try {
    const memUsage = process.memoryUsage()
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024)
    
    // Consider degraded if using more than 512MB
    const status = heapUsedMB > 512 ? 'degraded' : 'healthy'
    
    const result: { name: string; status: 'healthy' | 'degraded' | 'unhealthy'; duration: number; error?: string } = {
      name: 'memory_usage',
      status: status as 'healthy' | 'degraded',
      duration: Date.now() - startTime
    }
    
    if (status === 'degraded') {
      result.error = `High memory usage: ${heapUsedMB}MB/${heapTotalMB}MB`
    }
    
    return result
  } catch (error) {
    return {
      name: 'memory_usage',
      status: 'unhealthy' as const,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Memory check failed'
    }
  }
}

async function checkFileSystemAccess() {
  const startTime = Date.now()
  
  try {
    const fs = require('fs/promises')
    const path = require('path')
    
    // Try to access critical directories
    const criticalPaths = [
      'src',
      'src/app',
      'src/components',
      'src/lib',
      'docs'
    ]
    
    for (const dirPath of criticalPaths) {
      await fs.access(dirPath)
    }
    
    return {
      name: 'file_system_access',
      status: 'healthy' as const,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'file_system_access',
      status: 'unhealthy' as const,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'File system access failed'
    }
  }
}

async function checkEnvironmentVariables() {
  const startTime = Date.now()
  
  try {
    // Check for presence of NODE_ENV
    const nodeEnv = process.env.NODE_ENV
    const hasNodeEnv = Boolean(nodeEnv)
    
    // In development, we're more lenient
    const isDevelopment = nodeEnv === 'development'
    
    const status = hasNodeEnv ? 'healthy' : (isDevelopment ? 'degraded' : 'unhealthy')
    const result: { name: string; status: 'healthy' | 'degraded' | 'unhealthy'; duration: number; error?: string } = {
      name: 'environment_variables',
      status,
      duration: Date.now() - startTime
    }
    
    if (!hasNodeEnv) {
      result.error = 'NODE_ENV not set'
    }
    
    return result
  } catch (error) {
    return {
      name: 'environment_variables',
      status: 'unhealthy' as const,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Environment check failed'
    }
  }
}

async function checkConfigurationFiles() {
  const startTime = Date.now()
  
  try {
    const fs = require('fs/promises')
    
    // Check for critical config files
    const configFiles = [
      'package.json',
      'next.config.ts',
      'tailwind.config.ts',
      'tsconfig.json'
    ]
    
    for (const configFile of configFiles) {
      await fs.access(configFile)
    }
    
    return {
      name: 'configuration_files',
      status: 'healthy' as const,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'configuration_files',
      status: 'degraded' as const,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Config files check failed'
    }
  }
}

// Future expansion points for production:
// Database connectivity check (when Supabase is integrated)
// External API connectivity check (Stripe, Google Maps, etc.)
// Redis cache connectivity check
// Disk space usage check
// SSL certificate expiration check
