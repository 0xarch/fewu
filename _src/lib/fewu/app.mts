import PostDeployer from '#lib/deploy/post';
import Context from '#lib/fewu/context';
import { assignBasicLog } from '#lib/interface/log';
import { Source } from '#lib/local/local';

async function App() {

    const ctx = new Context();

    assignBasicLog(ctx);

    ctx.emit('startup', ctx);

    ctx.emit('afterStartup', ctx);

    ctx.emit('beforeProcess', ctx);

    ctx.emit('afterProcess', ctx);

    ctx.emit('beforeGenerate', ctx);

    ctx.emit('afterGenerate', ctx);

    ctx.emit('beforeDeploy', ctx);

    let posts = await Source.traverse(ctx,'post',[]);
    PostDeployer.deployAll(ctx, posts);

    ctx.emit('afterDeploy', ctx);

    ctx.emit('ready', ctx);

    ctx.emit('exit', ctx);
}

export default App;
