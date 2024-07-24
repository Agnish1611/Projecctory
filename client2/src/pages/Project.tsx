import { currentProjectAtom } from '@/store/currentProject';
import { useRecoilValueLoadable } from 'recoil'

const Project = () => {
    const project = useRecoilValueLoadable(currentProjectAtom);

    if (project.state == 'loading') {
        return (<div>Loading...</div>)
    } else {
        return (
            <div>{project.contents?.name}</div>
        )
    }
}

export default Project