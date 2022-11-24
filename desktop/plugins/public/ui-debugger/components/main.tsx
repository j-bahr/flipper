/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {useState} from 'react';
import {plugin} from '../index';
import {DetailSidebar, Layout, usePlugin, useValue} from 'flipper-plugin';
import {useHotkeys} from 'react-hotkeys-hook';
import {Id, Metadata, MetadataId, Snapshot, UINode} from '../types';
import {PerfStats} from './PerfStats';
import {Tree} from './Tree';
import {Visualization2D} from './Visualization2D';
import {useKeyboardModifiers} from '../hooks/useKeyboardModifiers';
import {Inspector} from './sidebar/Inspector';
import {Input, Spin} from 'antd';

export function Component() {
  const instance = usePlugin(plugin);
  const rootId = useValue(instance.rootId);
  const nodes: Map<Id, UINode> = useValue(instance.nodes);
  const metadata: Map<MetadataId, Metadata> = useValue(instance.metadata);

  const [showPerfStats, setShowPerfStats] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Id | undefined>(undefined);

  useHotkeys('ctrl+i', () => setShowPerfStats((show) => !show));

  const searchTerm = useValue(instance.searchTerm);
  const {ctrlPressed} = useKeyboardModifiers();

  function renderSidebar(
    node: UINode | undefined,
    metadata: Map<MetadataId, Metadata>,
  ) {
    if (!node) {
      return;
    }
    return (
      <DetailSidebar width={350}>
        <Inspector metadata={metadata} node={node} />
      </DetailSidebar>
    );
  }

  if (showPerfStats) return <PerfStats events={instance.perfEvents} />;

  if (rootId) {
    return (
      <Layout.Horizontal grow>
        <Layout.Container grow pad="medium" gap="small">
          <Input
            value={searchTerm}
            onChange={(e) => instance.searchTerm.set(e.target.value)}
          />
          <Layout.ScrollContainer>
            <Tree
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              nodes={nodes}
              rootId={rootId}
            />
          </Layout.ScrollContainer>
        </Layout.Container>
        <Visualization2D
          rootId={rootId}
          nodes={nodes}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          modifierPressed={ctrlPressed}
        />
        {selectedNode && renderSidebar(nodes.get(selectedNode), metadata)}
      </Layout.Horizontal>
    );
  }

  return (
    <Centered>
      <Spin data-testid="loading-indicator" />
    </Centered>
  );
}

export function Centered(props: {children: React.ReactNode}) {
  return (
    <Layout.Horizontal center grow>
      <Layout.Container center grow>
        {props.children}
      </Layout.Container>
    </Layout.Horizontal>
  );
}