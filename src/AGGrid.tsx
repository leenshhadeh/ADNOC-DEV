import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import RequestExpandableGrid from "./app/GridSamples/ExpandableRequestGrid";
import BasicGrid from './app/GridSamples/BasicGrid';
import RowSpanning from './app/GridSamples/RowSpanning';




export default function AGGrid() {
    const modules = [AllCommunityModule];
    ModuleRegistry.registerModules(modules);
    return (
        <AgGridProvider modules={modules}>
            <BasicGrid/>
            <RowSpanning/>
            <RequestExpandableGrid/>
        </AgGridProvider>
    );
}



