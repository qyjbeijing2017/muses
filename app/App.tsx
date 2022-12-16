import './app.css';
import { Layout } from "antd"
import React, { useState } from "react"
import { Engine } from './engine';
const { Sider } = Layout;

export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const ref = React.useRef<HTMLCanvasElement>(null);
    const [engine, setEngine] = useState<Engine | null>(null);

    React.useEffect(() => {
        if (ref.current) {
            const engine = new Engine(ref.current);
            setEngine(engine);
            engine.materialSrc = "http://localhost:3000/default.shader";
            engine.loop();
            return () => {
                engine.exit();
            }
        }
    }, [ref]);

    
    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        </Sider>
        <Layout>
            <canvas ref={ref} width={1920} height={1080} style={{ height: '100vh' }} />
        </Layout>
    </Layout>
}