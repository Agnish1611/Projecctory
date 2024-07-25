import { currentProjectAtom } from '@/store/currentProject';
import { useRecoilValueLoadable } from 'recoil'

const Project = () => {
    const project = useRecoilValueLoadable(currentProjectAtom);
    return(
        <section className="w-full h-screen bg-zinc-950 flex gap-2 p-2 text-white">
            {
                (project.state == 'loading') ?
                    (<div>Loading...</div>)
                    :
                    (
                        <div>{project.contents?.name}</div>
                    )
                
            }
        </section>
    )
}

export default Project