import G6 from '@antv/g6';

export function RevealGraph(data) {
    const graph =  new G6.Graph({
        container: 'mountNode',
        width: 1400 - 24*2,
        height: 500,
        fitView: true,
        modes: {
            default: ['drag-canvas', 'zoom-canvas'],
        },
        defaultEdge: {
            labelCfg: {
                autoRotate: true,
                refY: 8,
                style: {
                    fill: '#269',
                }
            },
        }
    });
    graph.data(data);
    graph.render();
}
