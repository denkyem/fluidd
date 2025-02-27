import Vue from 'vue'
import { MutationTree } from 'vuex'
import { defaultState } from './'
import { ServerState } from './types'

export const mutations: MutationTree<ServerState> = {
  /**
   * Reset state
   */
  setReset (state) {
    Object.assign(state, defaultState())
  },

  setServerInfo (state, payload) {
    Vue.set(state, 'info', payload)
  },

  /**
   * On initial init we get the server (moonraker) configuration.
   */
  setServerConfig (state, payload) {
    state.config = { ...state.config, ...payload }
  },

  /**
   * On initial init, we get the server (moonraker) process stats and any throttled state flags.
   */
  setMoonrakerStats (state, payload) {
    if (payload.cpu_temp) Vue.set(state, 'cpu_temp', payload.cpu_temp)
    if (payload.throttled_state) state.throttled_state = { ...state.throttled_state, ...payload.throttled_state }
    if (
      payload.moonraker_stats &&
      Array.isArray(payload.moonraker_stats)
    ) {
      // Update with array.
      Vue.set(state, 'moonraker_stats', payload.moonraker_stats)
    } else {
      // Append to array.
      if (state.moonraker_stats) {
        state.moonraker_stats.push(payload.moonraker_stats)
        while (state.moonraker_stats.length > 30) {
          state.moonraker_stats.splice(0, 1)
        }
      }
    }
  },

  /**
   * Sets how many times we've retried connecting to klippy.
   */
  setKlippyRetries (state, payload: number) {
    state.klippy_retries = payload
  }
}
