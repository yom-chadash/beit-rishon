//@@begin top-note
  // plugin/js/hq.js (HQ_302: the light toggles in the regular engine; the same file as the First Temple's src/85-hq.js)
  // ===== HQ_302: the library part - three.js r160's GTAO (ground-truth ambient occlusion) and Poisson denoise shaders, verbatim from
  // examples/jsm/shaders/GTAOShader.js and PoissonDenoiseShader.js (MIT, as the rest of the bundled three.js); written by
  // tools/round-3.0.2/gen-hq-lib.mjs. Only HQ_make (below) uses them.
//@@end top-note
//@@begin HQ_LIB
        DEPTH_SWIZZLING: 'x',
//@@end HQ_LIB
//@@begin HQ_LIB-2
        uniform mat4 cameraProjectionMatrixInverse;		
//@@end HQ_LIB-2
//@@begin HQ_LIB-3
        vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
          vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
//@@end HQ_LIB-3
//@@begin HQ_LIB-4
        float getDepth(const vec2 uv) {  
          return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
        }

        float fetchDepth(const ivec2 uv) {   
          return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
//@@end HQ_LIB-4
//@@begin HQ_LIB-5
          if (depth >= 1.0) {
            discard;
            return;
          }
//@@end HQ_LIB-5
//@@begin HQ_LIB-6
          float ao = 0.0, totalWeight = 0.0;
//@@end HQ_LIB-6
//@@begin HQ_LIB-7
            vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
            sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

            vec3 viewDir = normalize(-viewPos.xyz);
//@@end HQ_LIB-7
//@@begin HQ_LIB-8
              vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	
//@@end HQ_LIB-8
//@@begin HQ_LIB-9
              }		
//@@end HQ_LIB-9
//@@begin HQ_LIB-10
          ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
//@@end HQ_LIB-10
//@@begin HQ_LIB-11
        'DEPTH_VALUE_SOURCE': 0,
//@@end HQ_LIB-11
//@@begin HQ_LIB-12
        vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
          vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
//@@end HQ_LIB-12
//@@begin HQ_LIB-13
        #if DEPTH_VALUE_SOURCE == 1    
          return textureLod(tDepth, uv.xy, 0.0).a;
        #else
          return textureLod(tDepth, uv.xy, 0.0).r;
        #endif
//@@end HQ_LIB-13
//@@begin HQ_LIB-14
          #if DEPTH_VALUE_SOURCE == 1    
            return texelFetch(tDepth, uv.xy, 0).a;
          #else
            return texelFetch(tDepth, uv.xy, 0).r;
          #endif
//@@end HQ_LIB-14
//@@begin HQ_LIB-15
          float depth = getDepth(vUv.xy);	
          vec3 viewNormal = getViewNormal(vUv);	
//@@end HQ_LIB-15
//@@begin HQ_LIB-16
          if (totalWeight > 0.) { 
//@@end HQ_LIB-16
//@@begin after-HQ_make-note


//@@end after-HQ_make-note
