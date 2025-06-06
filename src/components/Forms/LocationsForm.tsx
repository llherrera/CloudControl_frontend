import { useState, useEffect } from "react";

import { InfoPopover, LocationPopover } from "@/components";
import {
  Plus,
  Minus,
  MapPin,
  Save,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkAddLocations, thunkGetLocations } from "@/store/plan/thunks";

import {
  Coordinates,
  LocationInterface,
  locationTypes,
  LocFormProps,
  PaginationProps,
} from "@/interfaces";
import { notify, convertLocations } from "@/utils";

export const LocationsForm = ({ loc, locs }: LocFormProps) => {
  const dispatch = useAppDispatch();
  const { id_plan } = useAppSelector((store) => store.content);

  // Estado para el “parent” (tipo + nombre) de la sección
  const [location, setLocation] = useState<LocationInterface>({
    id_plan,
    type: "Localidad",
    name: "",
  });

  // Estado para la lista editable de localidades hijas
  const [data, setData] = useState<LocationInterface[]>([
    { id_plan, type: locationTypes.neighborhood, name: "" },
  ]);

  const blankLocation: LocationInterface = {
    id_plan,
    type: locationTypes.neighborhood,
    name: "",
  };

  // Cuando cambie la prop `loc` (parent), inicializamos el estado `location`
  useEffect(() => {
    if (loc) {
      setLocation({ id_plan, type: loc.type, name: loc.name });
    }
  }, [loc, id_plan]);

  // Cuando cambie la prop `locs` (array), copiamos a `data`
  useEffect(() => {
    if (locs && locs.length > 0) {
      setData(locs.map((l) => ({ ...l })));
    }
  }, [locs]);

  const addLocation = () => {
    setData((prev) => [...prev, blankLocation]);
  };

  const deleteLocation = () => {
    setData((prev) => prev.slice(0, -1));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [name]: value };
      return newData;
    });
  };

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], type: value as locationTypes };
      return newData;
    });
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocation = (value: Coordinates, index: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], lat: value.lat, lng: value.lng };
      return newData;
    });
  };

  const handleSubmit = () => {
    for (const locItem of data) {
      if (locItem.name === "") {
        return notify("Por favor llene todos los campos");
      }
      if (!locItem.lat && !locItem.lng) {
        return notify(
          `Por favor seleccionar ubicación de localidad: ${locItem.name}`
        );
      }
    }

    dispatch(
      thunkAddLocations({
        id_plan,
        locations: data,
        location: {
          id_plan,
          type: location.type,
          name: location.name,
        },
      })
    ).then(() => notify("Localidades Añadidas"))
    .then(() => dispatch(thunkGetLocations(id_plan)));
  };

  return (
    <div className="tw-flex tw-justify-center tw-mt-8 tw-pb-4">
      <form className="tw-shadow-lg tw-rounded-2xl tw-p-6 tw-bg-white tw-w-full md:tw-w-3/4 lg:tw-w-2/3">
        <div className="tw-flex tw-items-center tw-justify-between mb-6">
          <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-700">
            <MapPin className="inline-block tw-mr-2 tw-vertical-middle" size={24} />
            Gestión de Localidades / Barrios
          </h2>
          <InfoPopover
            content={
              "Las localidades y comunas agrupan barrios,\nlos corregimientos se conforman por veredas y centros poblados"
            }
          />
        </div>

        {/* Sección “parent”: tipo y nombre generales */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-6">
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">
              Tipo Principal
            </label>
            <select
              name="type"
              title={location.type}
              value={location.type}
              onChange={handleLocationChange}
              className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
            >
              <option value="">Seleccione...</option>
              <option value="Localidad">Localidad</option>
              <option value="Comuna">Comuna</option>
              <option value="Corregimiento">Corregimiento</option>
            </select>
          </div>
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">
              Nombre Principal
            </label>
            <input
              className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
              type="text"
              name="name"
              required
              placeholder="Ingrese nombre"
              onChange={handleLocationChange}
              value={location.name}
            />
          </div>
        </div>

        {/* Lista de localidades hijas (editables) */}
        <ul className="tw-space-y-4">
          {data.map((locationItem, index) => (
            <li
              key={index}
              className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 hover:tw-bg-gray-100 transition"
            >
              <div className="tw-flex tw-items-center tw-justify-between mb-3">
                <span className="tw-text-lg tw-font-medium tw-text-gray-700">
                  {`#${index + 1 < 10 ? "0" : ""}${index + 1}`}
                </span>
                <div className="tw-flex tw-space-x-2">
                  <button
                    type="button"
                    onClick={() => deleteLocation()}
                    className="tw-flex tw-items-center tw-text-red-500 hover:tw-text-red-700"
                    title="Eliminar esta fila"
                  >
                    <Minus size={20} />
                  </button>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">
                    Tipo de Localidad
                  </label>
                  <select
                    name="type"
                    title={locationItem.type}
                    value={locationItem.type}
                    onChange={(e) => handleTypeChange(e, index)}
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Barrio">Barrio</option>
                    <option value="vereda">Vereda</option>
                    <option value="Centro poblado">Centro poblado</option>
                  </select>
                </div>
                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">
                    Nombre de Localidad
                  </label>
                  <input
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
                    onChange={(e) => handleInputChange(e, index)}
                    value={locationItem.name}
                    type="text"
                    name="name"
                    placeholder="Ingrese nombre"
                    required
                  />
                </div>
                <div className="tw-flex tw-flex-col tw-justify-end">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="tw-flex tw-items-center tw-space-x-2 tw-text-green-600 hover:tw-text-green-800 tw-self-start"
                  >
                    <MapPin size={20} />
                    <span className="tw-text-sm">Marcar ubicación</span>
                  </button>
                  <LocationPopover
                    index={index}
                    callback={handleLocation}
                    item={locationItem}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="tw-flex tw-justify-between tw-items-center tw-mt-6">
          <button
            className="tw-flex tw-items-center tw-space-x-1 tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg transition"
            type="button"
            title="Agregar un nuevo nivel"
            onClick={addLocation}
          >
            <Plus size={18} />
            <span>Agregar fila</span>
          </button>
          <button
            className="tw-flex tw-items-center tw-space-x-1 tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg transition"
            type="button"
            title="Eliminar último nivel"
            onClick={deleteLocation}
          >
            <Minus size={18} />
            <span>Eliminar fila</span>
          </button>
        </div>

        <div className="tw-flex tw-justify-center tw-mt-8">
          <button
            className="tw-flex tw-items-center tw-space-x-2 tw-bg-greenColory hover:tw-bg-green-400 tw-text-white hover:tw-text-black tw-font-bold tw-px-6 tw-py-3 tw-rounded-xl transition"
            type="button"
            onClick={handleSubmit}
          >
            <Save size={20} />
            <span>Guardar cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const Pagination = ({ array, page, callback }: PaginationProps) => {
  return (
    <ul className="tw-flex tw-justify-center tw-gap-6 tw-py-4 tw-bg-white tw-shadow-sm">
      <li>
        <button
          title="Primero"
          disabled={page === 1}
          onClick={() => callback(1, false)}
          className="tw-disabled:tw-opacity-50"
        >
          {page === 1 ? (
            <ChevronsLeft size={20} color="#ccc" />
          ) : (
            <ChevronsLeft size={20} />
          )}
        </button>
      </li>
      <li>
        <button
          title="Anterior"
          disabled={page === 1}
          onClick={() => callback(page - 1, false)}
          className="tw-disabled:tw-opacity-50"
        >
          {page === 1 ? (
            <ChevronLeft size={20} color="#ccc" />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </li>

      {array.map((_, i) => {
        if (!(i > 0 && i < array.length - 1)) {
          return (
            <li
              key={i}
              className={`${
                page === i + 1 ? "tw-bg-green-100 tw-rounded-lg" : ""
              } tw-transition hover:tw-bg-gray-100 tw-px-2 tw-py-1`}
            >
              <button onClick={() => callback(i + 1, false)}>{i + 1}</button>
            </li>
          );
        } else if (page < 5) {
          if (i > 4) {
            if (i === 5) return <p key="dots-start">...</p>;
            return null;
          } else {
            return (
              <li
                key={i}
                className={`${
                  page === i + 1 ? "tw-bg-green-100 tw-rounded-lg" : ""
                } tw-transition hover:tw-bg-gray-100 tw-px-2 tw-py-1`}
              >
                <button onClick={() => callback(i + 1, false)}>{i + 1}</button>
              </li>
            );
          }
        } else if (page > array.length - 4) {
          if (i < array.length - 5) {
            if (i === array.length - 6) return <p key="dots-end">...</p>;
            return null;
          } else {
            return (
              <li
                key={i}
                className={`${
                  page === i + 1 ? "tw-bg-green-100 tw-rounded-lg" : ""
                } tw-transition hover:tw-bg-gray-100 tw-px-2 tw-py-1`}
              >
                <button onClick={() => callback(i + 1, false)}>{i + 1}</button>
              </li>
            );
          }
        } else {
          if (page === i) {
            return (
              <li key={i} className="tw-flex tw-items-center tw-gap-2">
                <p>...</p>
                <button
                  onClick={() => callback(i - 1, false)}
                  className="hover:tw-bg-gray-100 tw-rounded-lg tw-px-2 tw-py-1"
                >
                  {i - 1}
                </button>
                <button
                  onClick={() => callback(i, false)}
                  className="tw-bg-green-100 tw-rounded-lg tw-px-2 tw-py-1 tw-font-semibold"
                >
                  {i}
                </button>
                <button
                  onClick={() => callback(i + 1, false)}
                  className="hover:tw-bg-gray-100 tw-rounded-lg tw-px-2 tw-py-1"
                >
                  {i + 1}
                </button>
                <p>...</p>
              </li>
            );
          }
        }
        return null;
      })}

      <li>
        <button
          title={page === array.length ? 'Añadir localidad' : "Siguiente"}
          disabled={false}
          onClick={() => {
            if (page === array.length)
              callback(0, true)
            else
              callback(page + 1, false)
          }}
          className="tw-disabled:tw-opacity-50"
        >
          {page === array.length ? (
            <ChevronRight size={20} color="#ccc" />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </li>
      <li>
        <button
          title="Último"
          disabled={page === array.length}
          onClick={() => callback(array.length, false)}
          className="tw-disabled:tw-opacity-50"
        >
          {page === array.length ? (
            <ChevronsRight size={20} color="#ccc" />
          ) : (
            <ChevronsRight size={20} />
          )}
        </button>
      </li>
    </ul>
  );
};

export const LocationsFormPage = () => {
  const dispatch = useAppDispatch();
  const { loadingLocations, locations } = useAppSelector((store) => store.plan);
  const { id_plan } = useAppSelector((store) => store.content);

  const [locationsMap, setLocationsMap] = useState<
    Map<LocationInterface, LocationInterface[]>
  >();
  const [locations_, setLocations_] = useState<LocationInterface[]>([]);
  const [locations__, setLocations__] = useState<LocationInterface[]>([]);
  const [page, setPage] = useState(1);

  const handlePage = (newPage: number, opt: boolean) => {
    if (!opt) {
      setPage(newPage);
    } else {
      let newLocs = convertLocations(locations!);
      newLocs.set(
        {
          id_plan: id_plan,
          type: 'Localidad',
          name: ''
        },
        []
      );
      setLocationsMap(newLocs);
      setPage(page+1);
    }
  }

  useEffect(() => {
    if (locations === undefined || locations.length == 0) dispatch(thunkGetLocations(id_plan));
  }, [locations, dispatch, id_plan]);

  useEffect(() => {
    if (!locations || locations.length === 0) return;
    setLocationsMap(convertLocations(locations));
  }, [locations]);

  useEffect(() => {
    if (!locationsMap) return;
    const locsTemp = Array.from(locationsMap.keys());
    const locTemp = locationsMap.get(locsTemp[page - 1]);
    setLocations_(locsTemp);
    setLocations__(locTemp ?? []);
  }, [locationsMap, page]);

  return loadingLocations ? (
    <p className="tw-text-center tw-mt-8">Cargando...</p>
  ) : (
    <div className="tw-flex tw-flex-col tw-justify-center tw-space-y-4">
      <Pagination array={locations_} page={page} callback={handlePage} />
      <LocationsForm loc={locations_[page - 1]} locs={locations__.length==0?undefined:locations__} />
    </div>
  );
};

