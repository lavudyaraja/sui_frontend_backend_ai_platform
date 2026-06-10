export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/config";

// Use centralized backend URL configuration
const BACKEND_URL = API_CONFIG.BACKEND_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Training API Route called");
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("📦 Request body:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const trainingData = {
      model_type: body.model_type || body.modelType || "mlp",
      epochs: body.epochs || 10,
      batch_size: body.batch_size || body.batchSize || 32,
      learning_rate: body.learning_rate || body.learningRate || 0.001,
      dataset_cid: body.dataset_cid || body.datasetCID || null,
      optimizer: body.optimizer || "adam",
      validation_split: body.validation_split || body.validationSplit || 0.2,
    };

    console.log("🚀 Sending to backend:", BACKEND_URL);
    console.log("📋 Training data:", JSON.stringify(trainingData, null, 2));

    // Call backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let backendResponse;
    try {
      backendResponse = await fetch(`${BACKEND_URL}/api/training/start`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(trainingData),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error("⏱️  Backend request timeout");
        return NextResponse.json(
          { 
            success: false, 
            error: "Backend request timed out after 30 seconds. Please ensure the backend server is running." 
          },
          { status: 504 }
        );
      }
      
      console.error("❌ Backend connection failed:", fetchError);
      
      // Provide helpful error message based on environment
      let errorMessage = `Cannot connect to backend at ${BACKEND_URL || 'undefined'}. `;
      
      if (!BACKEND_URL || BACKEND_URL === '') {
        errorMessage = 'Backend URL is not configured. ';
        if (process.env.VERCEL === '1') {
          errorMessage += 'Please set NEXT_PUBLIC_BACKEND_URL in Vercel environment variables (Settings → Environment Variables).';
        } else {
          errorMessage += 'Please set NEXT_PUBLIC_BACKEND_URL environment variable.';
        }
      } else {
        errorMessage += 'Please ensure the backend server is running and accessible.';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: fetchError.message,
          backend_url: BACKEND_URL || 'not configured'
        },
        { status: 503 }
      );
    }

    clearTimeout(timeoutId);

    console.log("📡 Backend response status:", backendResponse.status);

    // Handle non-OK responses
    if (!backendResponse.ok) {
      let errorText;
      try {
        errorText = await backendResponse.text();
        console.error("❌ Backend error response:", errorText);
      } catch (e) {
        errorText = "Unknown backend error";
      }

      // Try to parse as JSON
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }

      return NextResponse.json(
        { 
          success: false, 
          error: errorData.detail || errorText || "Backend request failed",
          status_code: backendResponse.status 
        },
        { status: backendResponse.status }
      );
    }

    // Parse successful response
    let data;
    try {
      data = await backendResponse.json();
      console.log("✅ Backend response:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error("❌ Failed to parse backend response:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON response from backend" },
        { status: 502 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      session_id: data.session_id,
      status: data.status,
      message: data.message || "Training session started",
      timestamp: data.timestamp,
    });

  } catch (err: any) {
    console.error("❌ Frontend API Route ERROR:", err);
    console.error("Stack trace:", err.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || "Internal server error",
        type: err.name || "UnknownError"
      },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET() {
  return NextResponse.json({
    message: "Training API endpoint",
    method: "POST",
    backend_url: BACKEND_URL,
    status: "ready"
  });
}