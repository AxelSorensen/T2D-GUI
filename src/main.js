import { createApp } from 'vue'
import App from './App.vue'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'
import VueTour from 'vue-tour'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faMaximize } from '@fortawesome/free-solid-svg-icons'
import { faMinimize } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './registerServiceWorker'
import router from './router'


library.add(faXmark)
library.add(faGear)
library.add(faCheck)
library.add(faChevronDown)
library.add(faChevronRight)
library.add(faPlus)
library.add(faSliders)
library.add(faFloppyDisk)
library.add(faUpload)
library.add(faDownload)
library.add(faFileImport)
library.add(faFileExport)
library.add(faPlay)
library.add(faMaximize)
library.add(faMinimize)
library.add(faChartLine)
library.add(faBars)
library.add(faExclamationCircle)
library.add(faEllipsisVertical)
library.add(faChevronLeft)
library.add(faHistory)
library.add(faMagnifyingGlass)
library.add(faEye)
library.add(faEyeSlash)
createApp(App).use(router).use(router).use(require('vue-cookies')).use(VueChartkick).component('font-awesome-icon', FontAwesomeIcon).directive('focus', {
  mounted: function (el, binding) {
    if(binding.value != 'endTime') {
      el.focus()
    }

  }
}).mount('#app')
