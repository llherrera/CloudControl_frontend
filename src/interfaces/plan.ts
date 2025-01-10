import { ErrorTypeInterface } from "./common";
import {
    PDTInterface,
    LevelInterface,
    NodeInterface,
    LocationInterface,
    UnitNodeResultInterface } from "./formInterfaces";
import { Coordinates } from "./ubication";
import { Secretary } from "./secretary";

export interface InitialStatePlanInterface {
    loadingPlan: boolean;
    loadingColors: boolean;
    loadingNodes: boolean;
    loadingLevels: boolean;
    loadingNamesTree: boolean;
    loadingLogo: boolean;
    loadingSecretaries: boolean;
    loadingReport: boolean;
    loadingLocations: boolean;
    loadingProjects: boolean;
    loadingActionPlan: boolean;
    loadingActivityActionPlan: boolean;
    errorLoadingPlan: ErrorTypeInterface;
    errorLoadingColors: ErrorTypeInterface;
    errorLoadingNodes: ErrorTypeInterface;
    errorLoadingLevels: ErrorTypeInterface;
    errorLoadingNamesTree: ErrorTypeInterface;
    errorLoadingLogo: ErrorTypeInterface;
    errorLoadingSecretaries: ErrorTypeInterface;
    errorLoadingLocations: ErrorTypeInterface;
    errorLoadingProjects: ErrorTypeInterface;
    errorLoadingActionPlan: ErrorTypeInterface;
    errorLoadingActivityActionPlan: ErrorTypeInterface;
    plan?: PDTInterface;
    colorimeter: number[];
    color?: boolean;
    nodes: NodeInterface[];
    nodesReport: Node[];
    years: number[];
    yearSelect?: number;
    levels: LevelInterface[];
    indexLevel: number;
    parent: string | null;
    progressNodes: number[];
    financial: number[];
    namesTree: Root[];
    rootTree: string[][];
    radioBtn: string;
    secretaries?: Secretary[];
    locations?: LocationInterface[];
    planLocation: Coordinates | undefined;
    bounding1: number;
    bounding2: number;
    bounding3: number;
    bounding4: number;
    projects?: Project[];
    proje_s: number;
    actionPlan?: ActionPlan[];
    selectedPlan?: ActionPlan;
    done: boolean;
}

export interface GetNodeProps {
    id_level: number;
    parent: (string | null);
}

export interface Root {
    nodo:string,
    nivel:string
}

export interface Node {
    id_node: string;
    name: string;
    description: string;
    parent: string | null;
    id_level: number;
    weight: number;
}

export interface AddColorsProps {
    id_plan: number;
    colors: number[];
}

export interface PDTDepartment {
    dept: string,
    muni: string;
}

export interface Level {
    id_plan: number;
    name: string;
    description: string;
    id_level: number;
}

export interface ExcelPlan {
    Descripcion: string;
    Id: string;
    Indicador: string;
    LineaBase: number | null;
    Meta: number | null;
    Niveles: string;
    Nodos: string;
    Peso: number;
    ProgramadoAnno1: number | null;
    ProgramadoAnno2: number | null;
    ProgramadoAnno3: number | null;
    ProgramadoAnno4: number | null;
    Responsable: string | null;
}

export interface ExcelFinancial {
    IdNodo: string;
    Anno1: number | null;
    Anno2: number | null;
    Anno3: number | null;
    Anno4: number | null;
}

export interface ExcelPhysical {
    IdNodo: string;
    Anno1: number | null;
    Anno2: number | null;
    Anno3: number | null;
    Anno4: number | null;
}

export interface ExcelUnitNode {
    IdNodo: string;
    ProgramadoAnno1: number | null;
    ProgramadoAnno2: number | null;
    ProgramadoAnno3: number | null;
    ProgramadoAnno4: number | null;

    EjecutadoAnno1: number | null;
    EjecutadoAnno2: number | null;
    EjecutadoAnno3: number | null;
    EjecutadoAnno4: number | null;

    FinanciadoAnno1: number | null;
    FinanciadoAnno2: number | null;
    FinanciadoAnno3: number | null;
    FinanciadoAnno4: number | null;
}

export interface UpdateWProps {
    ids: string[];
    weights: number[];
}

export interface AddLevelProps {
    id: string;
    levels: LevelInterface[];
}

export interface AddNodeProps {
    id_plan: number;
    nodes: NodeInterface[];
}

export interface PropsDeadline {
    id_plan: number;
    date: string;
}

export interface Project {
    readonly id_project: number;
    BPIM: number;
    entity: string;
    name: string;
    year: number;
    link: string;
}

export interface PropsGetProjects {
    id_plan: number;
    page: number;
    year: number;
}

export interface PropsGetProjectsCount {
    id_plan: number;
    year?: number;
}

export interface PropsAddProjects {
    id_plan: number;
    project: Project;
    file: File;
}

export interface PropsUpdateProjects {
    id_project: number;
    project: Project;
}

export type levelsPlan = Record<`level${1 | 2 | 3}`, string>;
export interface ActionPlan {
    readonly id_actionPlan: number;
    readonly id_plan: number;
    planCode: string;
    office: string;
    programedDate: Date | null;
    followDate: Date | null;
    POAINameProject: string;
    BPIMCode: string;
    Objetives: string;
    level1: string;
    level2: string;
    level3: string;
    actions: Activity[];
    rubros: Rubro[];
    nodes: NodeActivityPlan[];
    nodesResult: UnitNodeResultInterface[];
}

export interface Activity {
    readonly id_activity: number;
    readonly id_actionPlan: number;
    activityDesc: string;
    unitMeter: string;
    amountP: number;
    totalCostP: number;
    municipioP: number;
    sgpP: number;
    regaliasP: number;
    otrosP: number;
    amountE: number;
    totalCostE: number;
    municipioE: number;
    sgpE: number;
    regaliasE: number;
    otrosE: number;
    start_date: Date | null;
    end_date: Date | null;
    phisicalIndicator: number;
    invertionIndicator: number;
    efficiencyIndicator: number;
}

export interface Rubro {
    readonly id_actionPlan: number;
    presupuestalCode: string;
    rubro: string;
}

export interface NodeActivityPlan {
    id_activity: number;
    id_node: string;
    name: string
}

export interface LevelActionPlan {
    id_plan: number;
    id_actionPlan: number;
    level: string;
    name: string;
}

export interface PropsAddActionPlan {
    id_plan: number;
    plan: ActionPlan;
    rubros: Rubro[];
}

export interface PropsAddActivity {
    id_plan: number;
    activities: Activity[];
    node: string;
}