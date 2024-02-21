import {Session} from "~/session";
import bodyToString from "~/utils/body";
import {joinWorkspaceRequestData, workspaceRequestData} from "~/types/v3/requests";
import {workspacesRes, workspaceRes, workspace} from "~/types/v3";

class GetWorkspaces {

    session: Session;

    constructor(session: Session) {
        this.session = session;
    }

    async fetch(): Promise<Array<workspace>> {
        const url = `/v3/E/${this.session.student.id}/espacestravail.awp?verbe=get`;
        const data = {} as workspaceRequestData;
        return await this.session.request.post(url, bodyToString(data)).then((response: workspacesRes) => response.data as Array<workspace>);
    }

    async get(id: string): workspace {
        const url = `/v3/E/${this.session.student.id}/espacestravail/${id}.awp?verbe=get`;
        const data = {} as workspaceRequestData;
        return await this.session.request.post(url, bodyToString(data)).then((response: workspaceRes) => response.data as workspace);
    }

    async join(espace: workspace): emptyRes {
        const url = `/v3/E/${this.session.student.id}/espacestravail/${espace.id}/acces.awp?verbe=post`;
        const data = {} as joinWorkspaceRequestData;
        return await this.session.request.post(url, bodyToString(data)).then((response: emptyRes) => response);
    }

    async leave(espace: number): emptyRes {
        const url = `/v3/E/${this.session.student.id}/espacestravail/${espace}/acces.awp?verbe=delete`;
        const data = {} as workspaceRequestData;
        return await this.session.request.post(url, bodyToString(data)).then((response: emptyRes) => response);
    }
}

export {
    GetWorkspaces
};
