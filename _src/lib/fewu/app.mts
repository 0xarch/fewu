import Context from '#lib/fewu/context';
import { assignBasicLog } from '#lib/interface/log';
import collectData from '#lib/data/collect';

const ctx = new Context();

async function App() {

    assignBasicLog(ctx);

    ctx.emit('afterStartup', ctx);

    ctx.emit('beforeProcess', ctx);

    await collectData(ctx);

    ctx.emit('afterProcess', ctx);

    ctx.emit('beforeDeploy', ctx);

    await ctx.Deployer.run(ctx);

    ctx.emit('afterDeploy', ctx);

    ctx.emit('ready', ctx);

    ctx.emit('exit', ctx);
}

export default App;
export {
    App,
    ctx
}