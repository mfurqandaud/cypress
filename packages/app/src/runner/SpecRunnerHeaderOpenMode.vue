<template>
  <div
    id="spec-runner-header"
    ref="autHeaderEl"
    class="h-full bg-gray-1100 border-l-[1px] border-gray-900 min-h-[64px] text-[14px]"
  >
    <div class="flex flex-wrap grow p-[16px] gap-[12px] justify-end h-[64px]">
      <button
        data-cy="playground-activator"
        :disabled="isDisabled"
        class="bg-gray-1100 border rounded-md flex h-full border-gray-800 outline-solid outline-indigo-500 transition w-[40px] duration-150 items-center justify-center hover:bg-gray-800"
        :aria-label="t('runner.selectorPlayground.toggle')"
        :class="[selectorPlaygroundStore.show ? 'bg-gray-800 border-gray-700' : 'bg-gray-1100']"
        @click="togglePlayground"
      >
        <i-cy-crosshairs_x16 class="icon-dark-gray-300" />
      </button>
      <div
        data-cy="aut-url"
        class="border rounded bg-gray-950 flex grow border-gray-800 h-[32px] align-middle"
        :class="{
          'bg-gray-50': autStore.isLoadingUrl
        }"
      >
        <SpecRunnerDropdown
          v-if="selectedBrowser?.displayName"
          data-cy="select-browser"
          :disabled="autStore.isRunning"
        >
          <template #heading>
            <component
              :is="allBrowsersIcons[selectedBrowser.displayName?.toLowerCase()] || allBrowsersIcons.generic"
              class="min-w-[16px] w-[16px]"
              :alt="selectedBrowser.majorVersion ? `${selectedBrowser.displayName} ${selectedBrowser.majorVersion}` : selectedBrowser.displayName"
            />
          </template>
          <template #default>
            <div class="max-h-[50vh] overflow-auto">
              <VerticalBrowserListItems
                :gql="props.gql"
                :spec-path="activeSpecPath"
              />
            </div>
          </template>
        </SpecRunnerDropdown>
        <input
          ref="autUrlInputRef"
          data-cy="aut-url-input"
          :disabled="urlDisabled"
          :value="inputValue"
          :placeholder="inputPlaceholder"
          aria-label="url of the application under test"
          class="aut-url-input bg-gray-950 flex grow mr-[12px] leading-normal max-w-full text-gray-300 self-center hocus-link-default truncate"
          :style="{ zIndex: inputZIndex }"
          @input="setStudioUrl"
          @click="openExternally"
          @keyup.enter="visitUrl"
        >
        <StudioUrlPrompt
          v-if="studioStore.needsUrl && !urlDisabled"
          :aut-url-input-ref="autUrlInputRef"
          :url-in-progress="urlInProgress"
          :overlay-z-index="studioOverlayZIndex"
          @submit="visitUrl"
          @cancel="() => eventManager.emit('studio:cancel', undefined)"
        />
        <Tag
          data-cy="viewport-size"
          size="20"
          color="gray"
          :dark="true"
          class="self-center rounded-[10px] mr-[5px] pr-[6px] pl-[6px]"
        >
          <span class="whitespace-nowrap text-[12px]">{{ autStore.viewportWidth }}x{{
            autStore.viewportHeight
          }}</span>
        </Tag>
        <Tag
          v-if="displayScale"
          data-cy="viewport-scale"
          size="20"
          color="gray"
          :dark="true"
          class="self-center rounded-[10px] mr-[5px] pr-[6px] pl-[6px]"
        >
          <span class="text-[12px]">
            {{ displayScale }}
          </span>
        </Tag>
      </div>
    </div>

    <SelectorPlayground
      v-if="selectorPlaygroundStore.show"
      :get-aut-iframe="getAutIframe"
      :event-manager="eventManager"
    />

    <StudioControls v-if="studioStore.isActive" />

    <Alert
      v-model="showAlert"
      status="success"
      dismissible
    >
      <template #title>
        <i-cy-book_x16 class="pr-[2px] inline-block icon-dark-indigo-500 icon-light-indigo-200" />
        <ExternalLink href="https://on.cypress.io/styling-components">
          {{ t('runner.header.reviewDocs') }}
        </ExternalLink>
        {{ t('runner.header.troubleRendering') }}
      </template>
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAutStore, useSpecStore, useSelectorPlaygroundStore } from '../store'
import { useAutHeader } from './useAutHeader'
import { gql } from '@urql/vue'
import { useI18n } from 'vue-i18n'
import type { SpecRunnerHeaderFragment } from '../generated/graphql'
import type { EventManager } from './event-manager'
import type { AutIframe } from './aut-iframe'
import { togglePlayground as _togglePlayground } from './utils'
import Tag from '@cypress-design/vue-tag'
import SelectorPlayground from './selector-playground/SelectorPlayground.vue'
import ExternalLink from '@packages/frontend-shared/src/gql-components/ExternalLink.vue'
import Alert from '@packages/frontend-shared/src/components/Alert.vue'
import StudioControls from './studio/StudioControls.vue'
import StudioUrlPrompt from './studio/StudioUrlPrompt.vue'
import VerticalBrowserListItems from '@packages/frontend-shared/src/gql-components/topnav/VerticalBrowserListItems.vue'
import SpecRunnerDropdown from './SpecRunnerDropdown.vue'
import { allBrowsersIcons } from '@packages/frontend-shared/src/assets/browserLogos'
import { useStudioStore } from '../store/studio-store'
import { useExternalLink } from '@cy/gql-components/useExternalLink'

gql`
fragment SpecRunnerHeader on CurrentProject {
  id
  configFile
  currentTestingType
  activeBrowser {
    id
    displayName
    majorVersion
  }
  config
  ...VerticalBrowserListItems
}
`

const { t } = useI18n()

const autStore = useAutStore()

const specStore = useSpecStore()

const route = useRoute()

const studioStore = useStudioStore()

const urlInProgress = ref('')

const autUrlInputRef = ref<HTMLInputElement>()

const props = defineProps<{
  gql: SpecRunnerHeaderFragment
  eventManager: EventManager
  getAutIframe: () => AutIframe
}>()

const showAlert = ref(false)

const { autHeaderEl } = useAutHeader()

watchEffect(() => {
  showAlert.value = route.params.shouldShowTroubleRenderingAlert === 'true'
})

const autIframe = props.getAutIframe()

const studioOverlayZIndex = 50

const inputZIndex = computed(() => {
  // input needs to be above the Studio prompt overlay
  // but other times it needs to be below other resizable panels
  return studioStore.needsUrl ? studioOverlayZIndex + 1 : 5
})

const displayScale = computed(() => {
  return autStore.scale < 1 ? `${Math.round(autStore.scale * 100) }%` : 0
})

const autUrl = computed(() => {
  if (studioStore.isActive && studioStore.url) {
    return studioStore.url
  }

  return autStore.url
})

const selectorPlaygroundStore = useSelectorPlaygroundStore()

const togglePlayground = () => _togglePlayground(autIframe)

// Have to spread gql props since binding it to v-model causes error when testing
const selectedBrowser = ref({ ...props.gql.activeBrowser })

const activeSpecPath = specStore.activeSpec?.absolute

const isDisabled = computed(() => autStore.isRunning || autStore.isLoading)

const urlDisabled = computed(() => props.gql.currentTestingType === 'component')

const inputPlaceholder = computed(() => props.gql.currentTestingType === 'e2e' ? '' : 'URL navigation disabled in component testing')

const inputValue = computed(() => {
  if (props.gql.currentTestingType === 'component') {
    return ''
  }

  return studioStore.needsUrl ? urlInProgress.value : autUrl.value
})

const openExternal = useExternalLink()

function setStudioUrl (event: Event) {
  const url = (event.currentTarget as HTMLInputElement).value

  urlInProgress.value = url
}

function visitUrl () {
  studioStore.visitUrl(urlInProgress.value)
}

function openExternally () {
  if (!autStore.url || studioStore.isActive) {
    return
  }

  openExternal(autStore.url)
}
</script>

<style scoped>
.aut-url-input:disabled {
  background-color: transparent;
}

.aut-url-input:disabled:hover {
  text-decoration: none;
}
</style>
