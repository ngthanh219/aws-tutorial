export type AlertType = 'success' | 'error';

export interface IAlert {
    type: AlertType;
    message: string;
}
