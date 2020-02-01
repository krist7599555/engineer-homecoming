<template lang="pug">
  #home
    .hero.is-fullheight
      .hero-body
        .container.has-text-centered
          template(v-if='!nameList') loading...
          template(v-else-if='screen == 0')
            p.hula(:class='{"is-active": hula}')
              img.logo(src='../assets/logo.svg')
            template(v-if='curr')
              b(style='font-size: 5rem;') {{curr | fname}}
              br
              p(style='font-size: 3rem;') {{curr | fgen}}
              hr.myhr(:class='{"is-active": hula}')
            template(v-else)
              .title นำรายชื่อออก
            br
          template(v-else)
            img(src='../assets/logo.svg' style='width: 70vmin; margin-top: -8rem')
    .kfixed
      .buttons
        template(v-if='screen == 0')
          button.button(@click='removeCurrent' :disabled='selectIdx == null || running || interval') remove
          button.button(v-if='!running' @click='shuffle') shuffle
          button.button(v-else-if='running && interval' @click='stop') stop
          button.button(v-else disabled) stop
        button.button(@click='screen = screen ^ 1') screen {{screen}}
    footer.footer
      .container
        span DataBase 
        a(target='blank' href='https://docs.google.com/spreadsheets/d/1eEbzyLxhzDX-1W16OXK0cywdV09LahbAxTw4Q2XjA1E/edit') https://docs.google.com/spreadsheets/d/1eEbzyLxhzDX-1W16OXK0cywdV09LahbAxTw4Q2XjA1E/edit
        br
        span Github 
        a(target='blank' href='https://github.com/krist7599555/engineer-homecoming') https://github.com/krist7599555/engineer-homecoming
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import * as sheets from '../store/sheets';
import * as _ from 'lodash';

function sleep(t) {
  return new Promise(res => {
    setTimeout(res, t);
  });
}

function filter_name({ title, name, surname }) {
  return `${title} ${name} ${surname}`.trim();
}
function filter_gen({ section, generation }) {
  return `${section} ${generation}`.trim();
}

export default {
  name: 'home',
  components: {},
  filters: {
    fname: filter_name,
    fgen: filter_gen
  },
  data() {
    return {
      screen: 0,
      selectIdx: null,
      nameList: null,
      running: false,
      interval: null,
      hula: false
    };
  },
  async created() {
    this.nameList = await sheets.getNameList();
    this.next();
  },
  computed: {
    curr() {
      return _.get(this.nameList, this.selectIdx, null);
    }
  },
  methods: {
    next() {
      if (this.nameList.length == 1) {
        this.selectIdx = 0;
      } else {
        const i = this.selectIdx;
        while (i == this.selectIdx) {
          this.selectIdx = _.random(this.nameList.length - 1);
        }
      }
    },
    shuffle() {
      this.running = true;
      this.hula = false;
      this.interval = setInterval(() => this.next(), 20);
    },
    async stop() {
      clearInterval(this.interval);
      this.interval = null;
      let tim = 20.0;
      for (const idx in _.range(50)) {
        this.next();
        tim *= 1.04 + idx / 1000;
        await sleep(tim);
      }
      await sleep(300);
      this.next();
      this.hula = true;
      this.running = false;
    },
    removeCurrent() {
      this.nameList.splice(this.selectIdx, 1);
      this.selectIdx = null;
      this.nameList = this.nameList;
    }
  }
};
</script>

<style lang="scss">
#home > .hero {
  background-image: url(../assets/movie-theater-curtains.png);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/bg.jpg);
  background-position: top;
}
.hula {
  position: relative;
  top: -5rem;
  &:not(.is-active) {
    opacity: 0;
  }
}
.hula > .logo {
  width: 200px;
  position: absolute;
  transform: translate(-52%, -95%);
  z-index: -100;
}

.kfixed {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  padding: 1rem;
  // background-color: #eee8;
  border-radius: 8px;
}
.myhr {
  width: 10rem;
  margin: auto;
  margin-top: 3rem;
  background-color: #d7222b;
  height: 3px;
  &:not(.is-active) {
    opacity: 0;
  }
}
</style>
