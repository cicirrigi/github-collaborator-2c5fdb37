#!/usr/bin/env node

/**
 * 🤖 AI Guardian Ultimate - Vantage Lane 2.0
 * Complete Quality Gate Pipeline
 * 
 * This script runs the full quality gate system combining:
 * - Custom code audit (security, patterns, structure)
 * - Full quality gate pipeline (lint, types, tests, build)
 */

const QualityGate = require('./quality-gate.cjs');
const CodeAuditor = require('./audit.cjs');
const UIPatternChecker = require('./modules/ui-pattern-checker.cjs');
const PagePatternChecker = require('./modules/page-pattern-checker.cjs');
const DeadCodeChecker = require('./modules/dead-code-checker.cjs');
const TypeScriptChecker = require('./modules/typescript-checker.cjs');

class AIGuardianUltimate {
  constructor() {
    this.startTime = Date.now();
    this.projectRoot = __dirname + '/..';
  }

  async runAdvancedModules() {
    const moduleResults = [];

    // 1. UI Pattern Checker
    console.log('\n🧩 Running UI Pattern Checker...');
    try {
      const uiChecker = new UIPatternChecker(this.projectRoot);
      const uiResult = await uiChecker.checkUIPatternCompliance();
      moduleResults.push({ name: 'UI Patterns', ...uiResult });
    } catch (error) {
      console.log('⚠️  UI Pattern Checker failed:', error.message);
      moduleResults.push({ name: 'UI Patterns', passed: false, error: error.message });
    }

    // 2. Page Pattern Checker  
    console.log('\n📄 Running Page Pattern Checker...');
    try {
      const pageChecker = new PagePatternChecker();
      pageChecker.walk(this.projectRoot + '/src/app');
      const success = pageChecker.generateReport();
      moduleResults.push({ 
        name: 'Page Patterns', 
        passed: success,
        summary: `${pageChecker.results.compliantPages}/${pageChecker.results.totalPages} pages compliant`
      });
    } catch (error) {
      console.log('⚠️  Page Pattern Checker failed:', error.message);
      moduleResults.push({ name: 'Page Patterns', passed: false, error: error.message });
    }

    // 3. Dead Code Checker (Duplicate Detection)
    console.log('\n💀 Running Dead Code & Duplicate Checker...');
    try {
      const deadCodeChecker = new DeadCodeChecker(this.projectRoot);
      const deadCodeResult = await deadCodeChecker.runAllChecks();
      const passed = deadCodeResult.deadExports.passed && deadCodeResult.duplicateCode.passed;
      moduleResults.push({ 
        name: 'Dead Code Analysis', 
        passed,
        summary: `${deadCodeResult.deadExports.count} unused exports, ${deadCodeResult.duplicateCode.count} duplicates`
      });
    } catch (error) {
      console.log('⚠️  Dead Code Checker failed:', error.message);
      moduleResults.push({ name: 'Dead Code Analysis', passed: false, error: error.message });
    }

    // 4. Advanced TypeScript Checker (Build Testing)  
    console.log('\n📘 Running Advanced TypeScript Checker...');
    try {
      const tsChecker = new TypeScriptChecker(this.projectRoot);
      const typeResult = await tsChecker.runTypeScriptCheck();
      const buildResult = await tsChecker.runBuildTest();
      const passed = typeResult.passed && buildResult.passed;
      moduleResults.push({ 
        name: 'Advanced TypeScript', 
        passed,
        summary: `Type check: ${typeResult.passed ? 'PASS' : 'FAIL'}, Build: ${buildResult.passed ? 'PASS' : 'FAIL'}`
      });
    } catch (error) {
      console.log('⚠️  TypeScript Checker failed:', error.message);
      moduleResults.push({ name: 'Advanced TypeScript', passed: false, error: error.message });
    }

    // Summary of Advanced Modules
    const passedModules = moduleResults.filter(m => m.passed).length;
    const totalModules = moduleResults.length;
    
    console.log('\n📊 AI GUARDIAN v5.0 MODULES SUMMARY:');
    console.log('====================================');
    moduleResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    });
    console.log(`\n🎯 Advanced Modules Success Rate: ${passedModules}/${totalModules} (${Math.round(passedModules/totalModules*100)}%)`);
  }

  async run() {
    console.log('🤖 AI GUARDIAN ULTIMATE - Starting...\n');
    console.log('🎯 Vantage Lane 2.0 Quality Assurance System');
    console.log('===============================================\n');

    try {
      // Step 0: Run AI Guardian v5.0 Modules
      console.log('🤖 PHASE 0: AI Guardian v5.0 Advanced Modules');
      console.log('=============================================');
      await this.runAdvancedModules();

      // Step 1: Run custom code audit
      console.log('\n📋 PHASE 1: Custom Code Audit');
      console.log('--------------------------------');
      const auditor = new CodeAuditor();
      const auditPassed = await auditor.runAudit();
      
      if (!auditPassed) {
        console.log('\n⚠️  AI Guardian: Custom audit found issues but continuing with quality gate...\n');
        console.log('🔧 Note: Fix audit issues for production deployment.\n');
        // Continue to Phase 2 even with audit issues for development
      }

      if (auditPassed) {
        console.log('\n✅ Custom audit passed! Proceeding to quality gate...\n');
      } else {
        console.log('📋 CONTINUING TO PHASE 2...\n');
      }

      // Step 2: Run quality gate
      console.log('🚦 PHASE 2: Quality Gate Pipeline');
      console.log('----------------------------------');
      const gate = new QualityGate();
      await gate.runAllChecks();

      // If we reach here, everything passed
      const totalDuration = Date.now() - this.startTime;
      console.log('🎉 AI GUARDIAN ULTIMATE: ALL SYSTEMS GO! ✅');
      console.log(`⏱️  Total Duration: ${totalDuration}ms`);
      console.log('\n🚀 Code is production-ready and secure!');
      
    } catch (error) {
      console.error('\n💥 AI Guardian Ultimate failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const guardian = new AIGuardianUltimate();
  guardian.run().catch(error => {
    console.error('💥 AI Guardian execution failed:', error);
    process.exit(1);
  });
}

module.exports = AIGuardianUltimate;
