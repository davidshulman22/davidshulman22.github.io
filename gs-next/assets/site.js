document.documentElement.classList.add("js");

const initHeroWebGL = () => {
  const canvas = document.querySelector(".hero-webgl");
  const container = document.querySelector(".hero-visual");
  if (!canvas || !container) return;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pointer;

    #define MAX_STEPS 60
    #define MAX_DIST 8.0
    #define SURFACE .0025

    mat2 rotate2d(float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    float sphere(vec3 p, float r) {
      return length(p) - r;
    }

    float torus(vec3 p, vec2 t) {
      vec2 q = vec2(length(p.xz) - t.x, p.y);
      return length(q) - t.y;
    }

    vec2 scene(vec3 p) {
      p.yz *= rotate2d(-0.16 + u_pointer.y * .22);
      p.xz *= rotate2d(u_time * .16 + u_pointer.x * .30);

      vec2 result = vec2(sphere(p, .68), 1.0);

      vec3 ringA = p;
      float dA = torus(ringA, vec2(1.20, .045));
      if (dA < result.x) result = vec2(dA, 2.0);

      vec3 ringB = p;
      ringB.xy *= rotate2d(1.5708);
      ringB.yz *= rotate2d(.34);
      float dB = torus(ringB, vec2(1.20, .042));
      if (dB < result.x) result = vec2(dB, 3.0);

      vec3 ringC = p;
      ringC.xy *= rotate2d(1.5708);
      ringC.xz *= rotate2d(1.10);
      float dC = torus(ringC, vec2(.96, .026));
      if (dC < result.x) result = vec2(dC, 4.0);

      return result;
    }

    vec3 normalAt(vec3 p) {
      vec2 e = vec2(.002, 0.0);
      return normalize(vec3(
        scene(p + e.xyy).x - scene(p - e.xyy).x,
        scene(p + e.yxy).x - scene(p - e.yxy).x,
        scene(p + e.yyx).x - scene(p - e.yyx).x
      ));
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      vec3 rayOrigin = vec3(0.0, 0.0, 4.15);
      vec3 rayDirection = normalize(vec3(uv, -2.22));
      float distanceTraveled = 0.0;
      float material = 0.0;
      bool hit = false;

      for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = rayOrigin + rayDirection * distanceTraveled;
        vec2 samplePoint = scene(p);
        if (samplePoint.x < SURFACE) {
          material = samplePoint.y;
          hit = true;
          break;
        }
        distanceTraveled += samplePoint.x * .78;
        if (distanceTraveled > MAX_DIST) break;
      }

      if (!hit) {
        gl_FragColor = vec4(0.0);
        return;
      }

      vec3 p = rayOrigin + rayDirection * distanceTraveled;
      vec3 normal = normalAt(p);
      vec3 lightDirection = normalize(vec3(-.45, .78, 1.0));
      float diffuse = max(dot(normal, lightDirection), 0.0);
      float rim = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 2.4);
      vec3 halfVector = normalize(lightDirection - rayDirection);
      float specular = pow(max(dot(normal, halfVector), 0.0), material < 1.5 ? 42.0 : 18.0);

      vec3 coral = vec3(.933, .420, .263);
      vec3 cream = vec3(.957, .933, .855);
      vec3 sage = vec3(.725, .788, .741);
      vec3 color = coral;
      if (material > 1.5 && material < 2.5) color = cream;
      if (material > 2.5 && material < 3.5) color = sage;
      if (material > 3.5) color = mix(coral, cream, .28);

      float pulse = .96 + .04 * sin(u_time * 1.35);
      color *= (.38 + diffuse * .76) * pulse;
      color += rim * (material < 1.5 ? coral : cream) * .42;
      color += specular * vec3(1.0) * .88;

      float alpha = material < 1.5 ? .97 : .91;
      gl_FragColor = vec4(color * alpha, alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW);

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pointer = gl.getUniformLocation(program, "u_pointer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetPointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };
  let isVisible = true;
  let frame = 0;
  let startTime = performance.now();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.25) * .82;
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const draw = (now) => {
    frame = 0;
    resize();
    smoothPointer.x += (targetPointer.x - smoothPointer.x) * .055;
    smoothPointer.y += (targetPointer.y - smoothPointer.y) * .055;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, reducedMotion ? 1.8 : (now - startTime) / 1000);
    gl.uniform2f(pointer, smoothPointer.x, smoothPointer.y);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reducedMotion && isVisible && !document.hidden) frame = requestAnimationFrame(draw);
  };

  const restart = () => {
    if (reducedMotion || !isVisible || document.hidden || frame) return;
    frame = requestAnimationFrame(draw);
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    targetPointer.x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    targetPointer.y = -(((event.clientY - rect.top) / rect.height - .5) * 2);
  });
  canvas.addEventListener("pointerleave", () => {
    targetPointer.x = 0;
    targetPointer.y = 0;
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    container.classList.remove("webgl-ready");
    if (frame) cancelAnimationFrame(frame);
  });

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        restart();
      }
    }, { threshold: .04 });
    visibilityObserver.observe(canvas);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      restart();
    }
  });
  window.addEventListener("resize", () => {
    resize();
    if (reducedMotion) draw(performance.now());
  }, { passive: true });

  container.classList.add("webgl-ready");
  draw(performance.now());
};

initHeroWebGL();

const menu = document.querySelector(".menu");
if (menu) {
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.removeAttribute("open"));
  });
}

const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("visible"));
}

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});
