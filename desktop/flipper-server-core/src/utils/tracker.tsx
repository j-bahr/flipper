/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {getLogger} from 'flipper-common';

type TrackerEvents = {
  'server-auth-token-verification': {
    successful: boolean;
    present: boolean;
    error?: string;
  };
};

class ServerCoreTracker {
  track<Event extends keyof TrackerEvents>(
    event: Event,
    payload: TrackerEvents[Event],
  ): void {
    getLogger().track('usage', event, payload);
  }
}

export const tracker = new ServerCoreTracker();