import Context from '#lib/fewu/context';
import Console from '#util/Console';

async function App() {

    const ctx = new Context();

    ctx.emit('startup');

    ctx.emit('afterStartup');

    ctx.emit('beforeProcess');

    ctx.emit('afterProcess');

    ctx.emit('beforeGenerate');

    ctx.emit('afterGenerate');

    ctx.emit('beforeDeploy');

    ctx.emit('afterDeploy');

    ctx.emit('ready');

    ctx.emit('exit');
}

export default App;
