
export interface Shader {
    name: string,
    author?: string,
    link?: string,
    src: string,
}

export default [
    {
        name: 'Default',
        author: 'iq',
        link: 'https://www.shadertoy.com/user/iq',
        src: `
        // By iq: https://www.shadertoy.com/user/iq
        // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = fragCoord/iResolution.xy;
        
            // Time varying pixel color
            vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
            // col = vec3(step(0.5, length(uv - vec2(0.5))));
        
            // Output to screen
            fragColor = vec4(col,1.0);
        }
        `,
    },
    {
        name: 'Cyber Fuji 2020',
        author: 'kaiware007',
        link: 'https://www.shadertoy.com/view/Wt33Wf',
        src: `
        float sun(vec2 uv, float battery)
        {
            float val = smoothstep(0.3, 0.29, length(uv));
            float bloom = smoothstep(0.7, 0.0, length(uv));
            float cut = 3.0 * sin((uv.y + iTime * 0.2 * (battery + 0.02)) * 100.0) 
                        + clamp(uv.y * 14.0 + 1.0, -6.0, 6.0);
            cut = clamp(cut, 0.0, 1.0);
            return clamp(val * cut, 0.0, 1.0) + bloom * 0.6;
        }

        float grid(vec2 uv, float battery)
        {
            vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
            uv += vec2(0.0, iTime * 4.0 * (battery + 0.05));
            uv = abs(fract(uv) - 0.5);
            vec2 lines = smoothstep(size, vec2(0.0), uv);
            lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
            return clamp(lines.x + lines.y, 0.0, 3.0);
        }

        float dot2(in vec2 v ) { return dot(v,v); }

        float sdTrapezoid( in vec2 p, in float r1, float r2, float he )
        {
            vec2 k1 = vec2(r2,he);
            vec2 k2 = vec2(r2-r1,2.0*he);
            p.x = abs(p.x);
            vec2 ca = vec2(p.x-min(p.x,(p.y<0.0)?r1:r2), abs(p.y)-he);
            vec2 cb = p - k1 + k2*clamp( dot(k1-p,k2)/dot2(k2), 0.0, 1.0 );
            float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
            return s*sqrt( min(dot2(ca),dot2(cb)) );
        }

        float sdLine( in vec2 p, in vec2 a, in vec2 b )
        {
            vec2 pa = p-a, ba = b-a;
            float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
            return length( pa - ba*h );
        }

        float sdBox( in vec2 p, in vec2 b )
        {
            vec2 d = abs(p)-b;
            return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
        }

        float opSmoothUnion(float d1, float d2, float k){
            float h = clamp(0.5 + 0.5 * (d2 - d1) /k,0.0,1.0);
            return mix(d2, d1 , h) - k * h * ( 1.0 - h);
        }

        float sdCloud(in vec2 p, in vec2 a1, in vec2 b1, in vec2 a2, in vec2 b2, float w)
        {
            //float lineVal1 = smoothstep(w - 0.0001, w, sdLine(p, a1, b1));
            float lineVal1 = sdLine(p, a1, b1);
            float lineVal2 = sdLine(p, a2, b2);
            vec2 ww = vec2(w*1.5, 0.0);
            vec2 left = max(a1 + ww, a2 + ww);
            vec2 right = min(b1 - ww, b2 - ww);
            vec2 boxCenter = (left + right) * 0.5;
            //float boxW = right.x - left.x;
            float boxH = abs(a2.y - a1.y) * 0.5;
            //float boxVal = sdBox(p - boxCenter, vec2(boxW, boxH)) + w;
            float boxVal = sdBox(p - boxCenter, vec2(0.04, boxH)) + w;
            
            float uniVal1 = opSmoothUnion(lineVal1, boxVal, 0.05);
            float uniVal2 = opSmoothUnion(lineVal2, boxVal, 0.05);
            
            return min(uniVal1, uniVal2);
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv = (2.0 * fragCoord.xy - iResolution.xy)/iResolution.y;
            float battery = 1.0;
            //if (iMouse.x > 1.0 && iMouse.y > 1.0) battery = iMouse.y / iResolution.y;
            //else battery = 0.8;
            
            //if (abs(uv.x) < (9.0 / 16.0))
            {
                // Grid
                float fog = smoothstep(0.1, -0.02, abs(uv.y + 0.2));
                vec3 col = vec3(0.0, 0.1, 0.2);
                if (uv.y < -0.2)
                {
                    uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
                    uv.x *= uv.y * 1.0;
                    float gridVal = grid(uv, battery);
                    col = mix(col, vec3(1.0, 0.5, 1.0), gridVal);
                }
                else
                {
                    float fujiD = min(uv.y * 4.5 - 0.5, 1.0);
                    uv.y -= battery * 1.1 - 0.51;
                    
                    vec2 sunUV = uv;
                    vec2 fujiUV = uv;
                    
                    // Sun
                    sunUV += vec2(0.75, 0.2);
                    //uv.y -= 1.1 - 0.51;
                    col = vec3(1.0, 0.2, 1.0);
                    float sunVal = sun(sunUV, battery);
                    
                    col = mix(col, vec3(1.0, 0.4, 0.1), sunUV.y * 2.0 + 0.2);
                    col = mix(vec3(0.0, 0.0, 0.0), col, sunVal);
                    
                    // fuji
                    float fujiVal = sdTrapezoid( uv  + vec2(-0.75+sunUV.y * 0.0, 0.5), 1.75 + pow(uv.y * uv.y, 2.1), 0.2, 0.5);
                    float waveVal = uv.y + sin(uv.x * 20.0 + iTime * 2.0) * 0.05 + 0.2;
                    float wave_width = smoothstep(0.0,0.01,(waveVal));
                    
                    // fuji color
                    col = mix( col, mix(vec3(0.0, 0.0, 0.25), vec3(1.0, 0.0, 0.5), fujiD), step(fujiVal, 0.0));
                    // fuji top snow
                    col = mix( col, vec3(1.0, 0.5, 1.0), wave_width * step(fujiVal, 0.0));
                    // fuji outline
                    col = mix( col, vec3(1.0, 0.5, 1.0), 1.0-smoothstep(0.0,0.01,abs(fujiVal)) );
                    //col = mix( col, vec3(1.0, 1.0, 1.0), 1.0-smoothstep(0.03,0.04,abs(fujiVal)) );
                    //col = vec3(1.0, 1.0, 1.0) *(1.0-smoothstep(0.03,0.04,abs(fujiVal)));
                    
                    // horizon color
                    col += mix( col, mix(vec3(1.0, 0.12, 0.8), vec3(0.0, 0.0, 0.2), clamp(uv.y * 3.5 + 3.0, 0.0, 1.0)), step(0.0, fujiVal) );
                    
                    // cloud
                    vec2 cloudUV = uv;
                    cloudUV.x = mod(cloudUV.x + iTime * 0.1, 4.0) - 2.0;
                    float cloudTime = iTime * 0.5;
                    float cloudY = -0.5;
                    float cloudVal1 = sdCloud(cloudUV, 
                                            vec2(0.1 + sin(cloudTime + 140.5)*0.1,cloudY), 
                                            vec2(1.05 + cos(cloudTime * 0.9 - 36.56) * 0.1, cloudY), 
                                            vec2(0.2 + cos(cloudTime * 0.867 + 387.165) * 0.1,0.25+cloudY), 
                                            vec2(0.5 + cos(cloudTime * 0.9675 - 15.162) * 0.09, 0.25+cloudY), 0.075);
                    cloudY = -0.6;
                    float cloudVal2 = sdCloud(cloudUV, 
                                            vec2(-0.9 + cos(cloudTime * 1.02 + 541.75) * 0.1,cloudY), 
                                            vec2(-0.5 + sin(cloudTime * 0.9 - 316.56) * 0.1, cloudY), 
                                            vec2(-1.5 + cos(cloudTime * 0.867 + 37.165) * 0.1,0.25+cloudY), 
                                            vec2(-0.6 + sin(cloudTime * 0.9675 + 665.162) * 0.09, 0.25+cloudY), 0.075);
                    
                    float cloudVal = min(cloudVal1, cloudVal2);
                    
                    //col = mix(col, vec3(1.0,1.0,0.0), smoothstep(0.0751, 0.075, cloudVal));
                    col = mix(col, vec3(0.0, 0.0, 0.2), 1.0 - smoothstep(0.075 - 0.0001, 0.075, cloudVal));
                    col += vec3(1.0, 1.0, 1.0)*(1.0 - smoothstep(0.0,0.01,abs(cloudVal - 0.075)));
                }

                col += fog * fog * fog;
                col = mix(vec3(col.r, col.r, col.r) * 0.5, col, battery * 0.7);

        fragColor = vec4(col,1.0);
    }
    //else fragColor = vec4(0.0);

    
}
        `,
    },
    {
        name: 'Zippy Zaps [399 Chars]',
        author: 'SnoopethDuckDuck',
        link: 'https://www.shadertoy.com/view/XXyGzh',
        src: `
        // -13 thanks to Nguyen2007 ⚡

        void mainImage( out vec4 o, vec2 u )
        {
            vec2 v = iResolution.xy;
                u = .2*(u+u-v)/v.y;    
                
            vec4 z = o = vec4(1,2,3,0);
            
            for (float a = .5, t = iTime, i; 
                ++i < 19.; 
                o += (1. + cos(z+t)) 
                    / length((1.+i*dot(v,v)) 
                        * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
                )  
                v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u, 
                // use stanh here if shader has black artifacts
                //   vvvv
                u += tanh(40. * dot(u *= mat2(cos(i + .02*t - vec4(0,11,33,0)))
                                ,u)
                            * cos(1e2*u.yx + t)) / 2e2
                + .2 * a * u
                + cos(4./exp(dot(o,o)/1e2) + t) / 3e2;
                    
            o = 25.6 / (min(o, 13.) + 164. / o) 
            - dot(u, u) / 250.;
            o.w = 1.;
        }
        




        // Original [436]
        /*
        void mainImage( out vec4 o, vec2 u )
        {
            vec2 v = iResolution.xy, 
                w,
                k = u = .2*(u+u-v)/v.y;    
                
            o = vec4(1,2,3,0);
            
            for (float a = .5, t = iTime, i; 
                ++i < 19.; 
                o += (1.+ cos(vec4(0,1,3,0)+t)) 
                / length((1.+i*dot(v,v)) * sin(w*3.-9.*u.yx+t))
                )  
                v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u,         
                u *= mat2(cos(i+t*.02 - vec4(0,11,33,0))),
                u += .005 * tanh(40.*dot(u,u)*cos(1e2*u.yx+t))
                + .2 * a * u
                + .003 * cos(t+4.*exp(-.01*dot(o,o))),      
                w = u / (1. -2.*dot(u,u));
                    
            o = pow(o = 1.-sqrt(exp(-o*o*o/2e2)), .3*o/o) 
            - dot(k-=u,k) / 250.;
        }
        //*/
        `,
    },
    {
        name: 'Sparks drifting ',
        author: 'Sjeiti',
        link: 'https://www.shadertoy.com/view/MlKSWm',
        src: `
        //
        // Description : Array and textureless GLSL 2D/3D/4D simplex 
        //							 noise functions.
        //			Author : Ian McEwan, Ashima Arts.
        //	Maintainer : ijm
        //		 Lastmod : 20110822 (ijm)
        //		 License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //							 Distributed under the MIT License. See LICENSE file.
        //							 https://github.com/ashima/webgl-noise
        // 

        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
                return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v)
            { 
            const vec2	C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4	D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
            vec3 i	= floor(v + dot(v, C.yyy) );
            vec3 x0 =	 v - i + dot(i, C.xxx) ;

        // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //	 x0 = x0 - 0.0 + 0.0 * C.xxx;
            //	 x1 = x0 - i1	+ 1.0 * C.xxx;
            //	 x2 = x0 - i2	+ 2.0 * C.xxx;
            //	 x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;			// -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
            i = mod289(i); 
            vec4 p = permute( permute( permute( 
                                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3	ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);	//	mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );		// mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
            //vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

        // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                                                        dot(p2,x2), dot(p3,x3) ) );
            }

        //////////////////////////////////////////////////////////////

        // PRNG
        // From https://www.shadertoy.com/view/4djSRW
        float prng(in vec2 seed) {
            seed = fract (seed * vec2 (5.3983, 5.4427));
            seed += dot (seed.yx, seed.xy + vec2 (21.5351, 14.3137));
            return fract (seed.x * seed.y * 95.4337);
        }

        //////////////////////////////////////////////////////////////

        float PI = 3.1415926535897932384626433832795;

        float noiseStack(vec3 pos,int octaves,float falloff){
            float noise = snoise(vec3(pos));
            float off = 1.0;
            if (octaves>1) {
                pos *= 2.0;
                off *= falloff;
                noise = (1.0-off)*noise + off*snoise(vec3(pos));
            }
            if (octaves>2) {
                pos *= 2.0;
                off *= falloff;
                noise = (1.0-off)*noise + off*snoise(vec3(pos));
            }
            if (octaves>3) {
                pos *= 2.0;
                off *= falloff;
                noise = (1.0-off)*noise + off*snoise(vec3(pos));
            }
            return (1.0+noise)/2.0;
        }

        vec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){
            float displaceA = noiseStack(pos,octaves,falloff);
            float displaceB = noiseStack(pos+vec3(3984.293,423.21,5235.19),octaves,falloff);
            return vec2(displaceA,displaceB);
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                float time = iTime;
                vec2 resolution = iResolution.xy;
            vec2 drag = iMouse.xy;
            vec2 offset = iMouse.xy;
                //
            float xpart = fragCoord.x/resolution.x;
            float ypart = fragCoord.y/resolution.y;
            //
            float clip = 210.0;
            float ypartClip = fragCoord.y/clip;
            float ypartClippedFalloff = clamp(2.0-ypartClip,0.0,1.0);
            float ypartClipped = min(ypartClip,1.0);
            float ypartClippedn = 1.0-ypartClipped;
            //
            float xfuel = 1.0-abs(2.0*xpart-1.0);//pow(1.0-abs(2.0*xpart-1.0),0.5);
            //
            float timeSpeed = 0.5;
            float realTime = timeSpeed*time;
            //
            vec2 coordScaled = 0.01*fragCoord - 0.02*vec2(offset.x,0.0);
            vec3 position = vec3(coordScaled,0.0) + vec3(1223.0,6434.0,8425.0);
            vec3 flow = vec3(4.1*(0.5-xpart)*pow(ypartClippedn,4.0),-2.0*xfuel*pow(ypartClippedn,64.0),0.0);
            vec3 timing = realTime*vec3(0.0,-1.7,1.1) + flow;
            //
            vec3 displacePos = vec3(1.0,0.5,1.0)*2.4*position+realTime*vec3(0.01,-0.7,1.3);
            vec3 displace3 = vec3(noiseStackUV(displacePos,2,0.4,0.1),0.0);
            //
            vec3 noiseCoord = (vec3(2.0,1.0,1.0)*position+timing+0.4*displace3)/1.0;
            float noise = noiseStack(noiseCoord,3,0.4);
            //
            float flames = pow(ypartClipped,0.3*xfuel)*pow(noise,0.3*xfuel);
            //
            float f = ypartClippedFalloff*pow(1.0-flames*flames*flames,8.0);
            float fff = f*f*f;
            vec3 fire = 1.5*vec3(f, fff, fff*fff);
            //
            // smoke
            float smokeNoise = 0.5+snoise(0.4*position+timing*vec3(1.0,1.0,0.2))/2.0;
            vec3 smoke = vec3(0.3*pow(xfuel,3.0)*pow(ypart,2.0)*(smokeNoise+0.4*(1.0-noise)));
            //
            // sparks
            float sparkGridSize = 30.0;
            vec2 sparkCoord = fragCoord - vec2(2.0*offset.x,190.0*realTime);
            sparkCoord -= 30.0*noiseStackUV(0.01*vec3(sparkCoord,30.0*time),1,0.4,0.1);
            sparkCoord += 100.0*flow.xy;
            if (mod(sparkCoord.y/sparkGridSize,2.0)<1.0) sparkCoord.x += 0.5*sparkGridSize;
            vec2 sparkGridIndex = vec2(floor(sparkCoord/sparkGridSize));
            float sparkRandom = prng(sparkGridIndex);
            float sparkLife = min(10.0*(1.0-min((sparkGridIndex.y+(190.0*realTime/sparkGridSize))/(24.0-20.0*sparkRandom),1.0)),1.0);
            vec3 sparks = vec3(0.0);
            if (sparkLife>0.0) {
                float sparkSize = xfuel*xfuel*sparkRandom*0.08;
                float sparkRadians = 999.0*sparkRandom*2.0*PI + 2.0*time;
                vec2 sparkCircular = vec2(sin(sparkRadians),cos(sparkRadians));
                vec2 sparkOffset = (0.5-sparkSize)*sparkGridSize*sparkCircular;
                vec2 sparkModulus = mod(sparkCoord+sparkOffset,sparkGridSize) - 0.5*vec2(sparkGridSize);
                float sparkLength = length(sparkModulus);
                float sparksGray = max(0.0, 1.0 - sparkLength/(sparkSize*sparkGridSize));
                sparks = sparkLife*sparksGray*vec3(1.0,0.3,0.0);
            }
            //
            fragColor = vec4(max(fire,sparks)+smoke,1.0);
        }
        `,
    },
] as Shader[];