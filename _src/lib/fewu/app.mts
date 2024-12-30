import Context from '#lib/fewu/context';
import { assignBasicLog } from '#lib/interface/log';
import Deployer from '#lib/deployer/deployer';
import collectData from '#lib/data/collect';

async function App() {

    const ctx = new Context();

    assignBasicLog(ctx);

    ctx.emit('startup', ctx);

    ctx.emit('afterStartup', ctx);

    ctx.emit('beforeProcess', ctx);

    await collectData(ctx);

    ctx.emit('afterProcess', ctx);

    ctx.emit('beforeGenerate', ctx);

    ctx.emit('afterGenerate', ctx);

    ctx.emit('beforeDeploy', ctx);

    await Deployer.run(ctx);

    ctx.emit('afterDeploy', ctx);

    ctx.emit('ready', ctx);

    ctx.emit('exit', ctx);
}

export default App;
