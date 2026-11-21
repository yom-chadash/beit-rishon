//@@begin top-note
  // ===== HQ_302: the library part - three.js r187's GTAO (ground-truth ambient occlusion) and Poisson denoise shaders, verbatim from
  // examples/jsm/shaders/GTAOShader.js and PoissonDenoiseShader.js (MIT, as the rest of the bundled three.js); written by
  // tools/round-3.0.2/gen-hq-lib.mjs. Only HQ_make (below) uses them.
//@@end top-note
//@@begin HQ_LIB
//@@end HQ_LIB
//@@begin HQ_LIB-2
        uniform mat4 cameraProjectionMatrixInverse;
//@@end HQ_LIB-2
//@@begin HQ_LIB-3
        vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
          #ifdef USE_REVERSED_DEPTH_BUFFER
            vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
          #else
            vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
          #endif
//@@end HQ_LIB-3
//@@begin HQ_LIB-4
        float getDepth(const vec2 uv) {
          return textureLod(tDepth, uv.xy, 0.0).r;
        }

        float fetchDepth(const ivec2 uv) {
          return texelFetch(tDepth, uv.xy, 0).r;
//@@end HQ_LIB-4
//@@begin HQ_LIB-5

          #ifdef USE_REVERSED_DEPTH_BUFFER
            if (depth <= 0.0) {
              discard;
              return;
            }
          #else
            if (depth >= 1.0) {
              discard;
              return;
            }
          #endif

//@@end HQ_LIB-5
//@@begin HQ_LIB-6
          float ao = 0.0;
//@@end HQ_LIB-6
//@@begin HQ_LIB-7
            vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
            sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

            #if PERSPECTIVE_CAMERA == 1
              vec3 viewDir = normalize(-viewPos.xyz);
            #else
              vec3 viewDir = vec3(0., 0., 1.);
            #endif
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
//@@end HQ_LIB-11
//@@begin HQ_LIB-12
        vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
          #ifdef USE_REVERSED_DEPTH_BUFFER
            vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
          #else
            vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
          #endif
//@@end HQ_LIB-12
//@@begin HQ_LIB-13
          return textureLod(tDepth, uv.xy, 0.0).r;
//@@end HQ_LIB-13
//@@begin HQ_LIB-14
          return texelFetch(tDepth, uv.xy, 0).r;
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
