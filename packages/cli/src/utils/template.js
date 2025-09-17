import degit from "degit";

export async function fetchTemplate(templateRepo, targetDir) {
    const emitter = degit(templateRepo, { cache: false, force: true, verbose: false });
    try {
        await emitter.clone(targetDir);
        return true;
    } catch {
        return false;
    }
}
