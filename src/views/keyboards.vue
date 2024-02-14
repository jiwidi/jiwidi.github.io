<template>
    <div class="creative-container">
      <main class="shadowPlus4">
        <article>
          <h1>Many keyboards!</h1>
          <p>As someone who spends a lot of time at a keyboard, I consider it an extension of myself. Most keyboards are functional and get the job done, but if you want to improve your typing experience, you can go pretty overkill. These over-the-top keyboards don't offer any special features, but they are comfortable to use for long periods of time without causing hand strain. Building them from scratch by soldering, picking out components, and assembling them is a satisfying engineering challenge for me.</p>
          <section>

            <h2>Zoom 65</h2>
            <p>DIY Kit from <a href="https://zoom65.com/">https://zoom65.com/</a>.</p>
            <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/zoom65.jpg">
            <p>Details:</p>
            <ul>
              <li>Dracula GMK keycaps</li>
              <li>Zoom65 cnc case</li>
              <li>67 Tangerines</li>
              <li>Brass plate</li>
              <li>Durock v2 stabilizers</li>
            </ul>
            <h2>Tofu Jr</h2>
            <p>DIY Kit from <a href="https://kbdfans.com/products/tofu-jr">kbdfans</a>.</p>
            <!-- <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/tofujr.jpg"> -->
            <p>Details:</p>
            <ul>
              <li>Striker GMK keycaps</li>
              <li>Tofu cnc case</li>
              <li>67 Gateron Oil King switches</li>
              <li>Polycarbonate Plate</li>
              <li>Durock v2 stabilizers</li>
            </ul>
            <h2>Discipline 65</h2>
            <p>A custom discipline 65 <a href="https://github.com/coseyfannitutti/discipline">https://github.com/coseyfannitutti/discipline</a>.</p>
            <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/discipline.png">
            <p>Details:</p>
            <ul>
              <li>Akko Macaw keycaps, gmk nautilus knock off</li>
              <li>No case</li>
              <li>67G tactile Durock v1 switches</li>
              <li>No plate</li>
              <li>Durock stabilizers</li>
            </ul>

            <h2>Two idobao id80v2</h2>
            <p>Built two id80v2, one for me(black) and another one for my gf(white). First time I saw a case that acted as keyboard plate as well.</p>
            <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/idobao.png">
            <p>Details:</p>
            <ul>
              <li>GMK mito and Maxkey SA bluewhite set</li>
              <li>Idobao id80v2 cases</li>
              <li>67 G tactile holy pandas</li>
              <li>Case integrated plate</li>
              <li>Durock stabilizers</li>
            </ul>

            <h2>KBDfans 67 lite</h2>
            <p>DIY keyboard kit from kbdfans, easy to build and cheap.</p>
            <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/kbd67lite.png">
            <p>Details:</p>
            <ul>
              <li>GMK Modern Dolch light keycaps</li>
              <li>Kbdlite case</li>
              <li>67g tangerine linear switches</li>
              <li>XX plate</li>
              <li>Kbdfans stock stabilizers</li>
            </ul>

            <h2>Satan GH60</h2>
            <p>Satan 60 generic pcb along with a low profile walnut wooden case.</p>
            <img data-enlargable align="right" width="250" height="150" src="/src/assets/img/keyboards/satan2.png">
            <p>Details:</p>
            <ul>
              <li>SA blue/white keycaps</li>
              <li>Walnut case</li>
              <li>Marshmallow switches</li>
              <li>Polycarbonate plate</li>
              <li>Cherry screw stabilizers</li>
            </ul>

            <h2>Tada68</h2>
            <p>First mechanical keyboard, prebuilt bought from kbdfans.</p>
            <img data-enlargable align="right" width="250" height="200" src="/src/assets/img/keyboards/tada68.jpeg">
            <p>Details:</p>
            <ul>
              <li>Generic keycaps</li>
              <li>ABS plastic case</li>
              <li>67g tactile zealios v1</li>
              <li>Brass plate</li>
              <li>Kbdfans stock stabilizers</li>
            </ul>
          </section>
        </article>
        <listDisplay />
      </main>
    </div>
</template>

<script>
import listDisplay from '/src/components/listDisplay.vue';
export default {
    name: 'Creative',
    components: {
        listDisplay
    },
};
</script>
