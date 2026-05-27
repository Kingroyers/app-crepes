export interface IPdv{
  pdv: string;
  pdvF: string;
}

export interface IArea{
  area: string;
  areaF: string;
}


export interface IPuntoDeVenta{
  city: string;
  name: string;
  opened:string;
  closed: string;
  state: {
    description: string | null;
    start: string | null;
    end: string | null;
  } | null;
  status: string;
}
