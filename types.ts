
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum AppState {
  IDLE,
  PROCESSING,
  RESULT,
  ERROR,
}

declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}
