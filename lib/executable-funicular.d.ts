import { ICursor, ICursorEventsList } from 'ancient-cursor/lib/cursor';
import { IFunicularEventData, IFunicularEventsList, IFunicular } from './funicular';
declare type TExecutableFunicular = IExecutableFunicular<TExecutableFunicularCursor, IFunicularEventsList<IFunicularEventData>>;
interface IExecutableFunicularCursorData {
    type: string;
    globalName: string;
    value: any;
    childs: {
        [localName: string]: string;
    };
}
interface IExecutableFunicularCursor<IE extends ICursorEventsList> extends ICursor<IE> {
    data: undefined | IExecutableFunicularCursorData;
}
declare type TExecutableFunicularCursor = IExecutableFunicularCursor<ICursorEventsList>;
interface IExecutableFunicular<IC extends TExecutableFunicularCursor, IEventsList extends IFunicularEventsList<IFunicularEventData>> extends IFunicular<IC, IEventsList> {
}
export { IExecutableFunicular, TExecutableFunicular, IExecutableFunicularCursor, TExecutableFunicularCursor, IExecutableFunicularCursorData };
