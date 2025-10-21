#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

class QualityGate {
  constructor() {
    this.checks = [
      { 
        name: '🔍 ESLint Check', 
        command: 'npm run audit:lint',
        description: 'Code linting and style consistency'
      },
      { 
        name: '🧪 Test Suite', 
        command: 'npm run audit:test',
        description: 'Unit and integration tests'
      },
    ];
    this.results = [];
    this.startTime = Date.now();
  }

  async runCheck(check) {
    const checkStartTime = Date.now();
    
    try {
      console.log(`🔄 ${check.name}...`);
      console.log(`   ${check.description}`);
      
      execSync(check.command, { stdio: 'pipe' });
      
      const duration = Date.now() - checkStartTime;
      console.log(`✅ ${check.name}: PASSED (${duration}ms)`);
      
      return { 
        name: check.name, 
        passed: true, 
        duration,
        description: check.description
      };
    } catch (error) {
      const duration = Date.now() - checkStartTime;
      console.log(`❌ ${check.name}: FAILED (${duration}ms)`);
      
      // Show error output if available
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
      if (errorOutput && errorOutput.trim()) {
        console.log(`   Error details: ${errorOutput.slice(0, 200)}...`);
      }
      
      return { 
        name: check.name, 
        passed: false, 
        error: errorOutput,
        duration,
        description: check.description
      };
    }
  }

  async runAllChecks() {
    console.log('🚦 Quality Gate Starting...');
    console.log('=====================================');
    console.log('');
    
    for (const check of this.checks) {
      const result = await this.runCheck(check);
      this.results.push(result);
      console.log('');
    }
    
    this.reportFinalResults();
  }

  reportFinalResults() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const totalDuration = Date.now() - this.startTime;
    
    console.log('📊 QUALITY GATE FINAL RESULTS');
    console.log('=====================================');
    
    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      const duration = result.duration ? `(${result.duration}ms)` : '';
      console.log(`${icon} ${result.name} ${duration}`);
      
      if (!result.passed && result.error) {
        // Show first line of error for context
        const firstLine = result.error.split('\n')[0];
        console.log(`   └─ ${firstLine.slice(0, 80)}...`);
      }
    });
    
    console.log('');
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Success Rate: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
    console.log('');
    
    if (passed === total) {
      console.log('🎉 QUALITY GATE: ✅ ALL CHECKS PASSED');
      console.log('🚀 Code is production-ready!');
      console.log('');
      this.showSuccessActions();
      process.exit(0);
    } else {
      console.log('💥 QUALITY GATE: ❌ CHECKS FAILED');
      console.log(`🔧 ${total - passed} check(s) need attention.`);
      console.log('');
      this.showFailureActions();
      process.exit(1);
    }
  }

  showSuccessActions() {
    console.log('💡 Next Steps:');
    console.log('   • Commit your changes: git add . && git commit -m "feat: ..."');
    console.log('   • Push to remote: git push');
    console.log('   • Check QUALITY-REPORT.md for detailed analysis');
  }

  showFailureActions() {
    const failedChecks = this.results.filter(r => !r.passed);
    
    console.log('🛠️  How to Fix:');
    
    failedChecks.forEach(check => {
      console.log(`   ${check.name}:`);
      
      if (check.name.includes('ESLint')) {
        console.log('     → Run: npm run lint:fix');
        console.log('     → Check: eslint output for specific issues');
      } else if (check.name.includes('TypeScript')) {
        console.log('     → Run: npm run typecheck');
        console.log('     → Fix: type errors in reported files');
      } else if (check.name.includes('Test')) {
        console.log('     → Run: npm run test');
        console.log('     → Fix: failing test cases');
      } else if (check.name.includes('Custom')) {
        console.log('     → Check: file sizes (<250 lines)');
        console.log('     → Remove: console.log, any types');
        console.log('     → Review: QUALITY-REPORT.md for details');
      }
    });
    
    console.log('');
    console.log('📋 After fixing, re-run: npm run quality-gate');
  }

  // Generate summary for CI/CD systems
  generateCIOutput() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    return {
      success: passed === total,
      score: Math.round(passed/total*100),
      passed,
      total,
      duration: Date.now() - this.startTime,
      checks: this.results
    };
  }
}

// Run quality gate if called directly
if (require.main === module) {
  const gate = new QualityGate();
  gate.runAllChecks().catch(error => {
    console.error('💥 Quality gate execution failed:', error);
    process.exit(1);
  });
}

module.exports = QualityGate;
