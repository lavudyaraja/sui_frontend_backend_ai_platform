import { NextResponse } from 'next/server';
import { modelService } from '@/services/model.service';

// Cache for model data (1 minute TTL)
let cachedModelData: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * GET /api/model
 * Fetch model data from blockchain
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version');
    const modelId = searchParams.get('modelId');

    // Check cache validity
    const now = Date.now();
    if (cachedModelData && now - cacheTimestamp < CACHE_TTL && !version && !modelId) {
      return NextResponse.json({
        success: true,
        data: cachedModelData,
        cached: true,
        timestamp: now,
      });
    }

    // Fetch from blockchain
    const modelInfo = await modelService.getLatestModel();
    
    // Fetch pending gradients
    const pendingGradients = modelId 
      ? await modelService.fetchPendingGradients(modelId)
      : [];

    // Construct response
    const responseData = {
      version: modelInfo.version,
      weightsCid: modelInfo.latestWeightsCid,
      name: modelInfo.name,
      description: modelInfo.description,
      owner: modelInfo.owner,
      updatedAt: modelInfo.lastUpdated || Date.now(),
      contributorCount: modelInfo.totalContributions || 0,
      gradientCount: pendingGradients.length,
      pendingGradients: pendingGradients.map(g => ({
        contributor: g.contributor,
        cid: g.cid,
        timestamp: g.timestamp,
        validated: g.validated,
        metadata: g.metadata,
      })),
    };

    // Update cache
    if (!version && !modelId) {
      cachedModelData = responseData;
      cacheTimestamp = now;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: now,
    });
  } catch (error) {
    console.error('Model fetch error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch model data',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

/**
 * POST /api/model
 * Submit gradient or create model
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'submit_gradient': {
        const { modelId, gradientCid, metadata, signerData } = data;
        
        if (!modelId || !gradientCid || !signerData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: modelId, gradientCid, signerData',
          }, { status: 400 });
        }

        // Submit gradient to blockchain
        const txDigest = await modelService.submitGradientCid(
          modelId,
          gradientCid,
          metadata || {},
          signerData
        );

        // Invalidate cache
        cachedModelData = null;

        return NextResponse.json({
          success: true,
          data: {
            transactionDigest: txDigest,
            gradientCid,
            modelId,
          },
          timestamp: Date.now(),
        });
      }

      case 'validate_gradient': {
        const { modelId, gradientIdx, validationPoints, signerData } = data;
        
        if (!modelId || gradientIdx === undefined || !validationPoints || !signerData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
          }, { status: 400 });
        }

        const txDigest = await modelService.validateGradient(
          modelId,
          gradientIdx,
          validationPoints,
          signerData
        );

        return NextResponse.json({
          success: true,
          data: { transactionDigest: txDigest },
          timestamp: Date.now(),
        });
      }

      case 'finalize_aggregation': {
        const { modelId, newWeightsCid, signerData } = data;
        
        if (!modelId || !newWeightsCid || !signerData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
          }, { status: 400 });
        }

        const txDigest = await modelService.finalizeAggregation(
          modelId,
          newWeightsCid,
          signerData
        );

        // Invalidate cache
        cachedModelData = null;

        return NextResponse.json({
          success: true,
          data: { transactionDigest: txDigest },
          timestamp: Date.now(),
        });
      }

      case 'create_model': {
        const { name, description, initialWeightsCid, signerData } = data;
        
        if (!name || !description || !initialWeightsCid || !signerData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
          }, { status: 400 });
        }

        const txDigest = await modelService.createModel(
          name,
          description,
          initialWeightsCid,
          signerData
        );

        return NextResponse.json({
          success: true,
          data: { transactionDigest: txDigest },
          timestamp: Date.now(),
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Model operation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Operation failed',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

/**
 * DELETE /api/model
 * Clear cache (admin only)
 */
export async function DELETE() {
  cachedModelData = null;
  cacheTimestamp = 0;
  
  return NextResponse.json({
    success: true,
    message: 'Cache cleared',
    timestamp: Date.now(),
  });
}