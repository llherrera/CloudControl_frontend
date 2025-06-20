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
import { thunkAddLocations, thunkGetLocations, thunkUpdateLocations, thunkDeleteLocation } from "@/store/plan/thunks";

import {
  Coordinates,
  LocationInterface,
  locationTypes,
  LocFormProps,
} from "@/interfaces";
import { notify, convertLocations } from "@/utils";

export const LocationsForm = ({ loc, locs, currentLocationId }: LocFormProps & { currentLocationId?: number }) => {
  const dispatch = useAppDispatch();
  const { id_plan } = useAppSelector((store) => store.content);

  // Estado para el "parent" (tipo + nombre) de la sección
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
    if (locs) {
      setData(locs.map((l) => ({ ...l })));
    } else {
      setData([]);
    }
  }, [locs]);

  const addLocation = () => {
    setData((prev) => {
      if (!prev || prev.length === 0) {
        return [blankLocation];
      }
      return [...prev, blankLocation];
    });
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
    // Si lat/lng están vacíos, poner 0
    const sanitizedData = data.map((locItem) => ({
      ...locItem,
      lat: locItem.lat === undefined || locItem.lat === null ? 0 : locItem.lat,
      lng: locItem.lng === undefined || locItem.lng === null ? 0 : locItem.lng,
    }));

    for (const locItem of sanitizedData) {
      if (locItem.name === "") {
        return notify("Por favor llene todos los campos");
      }
    }

    const isEditing = loc && loc.name && loc.name !== "";
    console.log("Usando thunk:", isEditing ? "thunkUpdateLocations" : "thunkAddLocations");

    if (isEditing && currentLocationId) {
      console.log("editando");
      // Si es edición, primero eliminar la localidad existente
      dispatch(thunkDeleteLocation(currentLocationId))
        .then(() => {
          // Después de eliminar, agregar las nuevas localidades
          return dispatch(
            thunkAddLocations({
              id_plan,
              locations: sanitizedData,
              location: {
                id_plan,
                type: location.type,
                name: location.name,
              },
            })
          );
        })
        .then(() => {
          notify("Localidades actualizadas");
          dispatch(thunkGetLocations(id_plan));
        });
    } else {
      // Si es nueva localidad, solo agregar
      dispatch(
        thunkAddLocations({
          id_plan,
          locations: sanitizedData,
          location: {
            id_plan,
            type: location.type,
            name: location.name,
          },
        })
      )
        .then(() => {
          notify("Localidades añadidas");
          dispatch(thunkGetLocations(id_plan));
        });
    }
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

        {/* Sección "parent": tipo y nombre generales */}
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
        {(data === undefined || data.length === 0) ? (
          <div className="tw-text-center tw-text-gray-500 tw-my-8">No hay localidades</div>
        ) : (
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
                      onClick={() => { }}
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
                    {(locationItem.lat === 0 && locationItem.lng === 0) && (
                      <span className="tw-text-xs tw-text-red-500 tw-mt-1">localidad no definida</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

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

type PaginationPropsLocal = {
  array: LocationInterface[];
  page: number;
  callback: (newPage: number, opt: boolean) => void;
  setShowAddMainModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Pagination = ({ array, page, callback, setShowAddMainModal }: PaginationPropsLocal) => {
  return (
    <div className="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-4 tw-mx-32 tw-overflow-x-auto">
      <nav className="tw-flex tw-items-center tw-justify-center tw-gap-4">
        {/* Botón a la primera página */}
        <button
          title="Primero"
          disabled={page === 1}
          onClick={() => callback(1, false)}
          className="tw-p-2 tw-rounded-full tw-transition-colors hover:tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          <ChevronsLeft size={20} />
        </button>

        {/* Botón a la página anterior */}
        <button
          title="Anterior"
          disabled={page === 1}
          onClick={() => callback(page - 1, false)}
          className="tw-p-2 tw-rounded-full tw-transition-colors hover:tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Números de página */}
        <div className="tw-flex tw-items-center tw-gap-2">
          {array.map((_, i) => (
            <button
              key={i}
              onClick={() => callback(i + 1, false)}
              className={`tw-w-10 tw-h-10 tw-rounded-full tw-transition-colors ${
                page === i + 1
                  ? "tw-bg-green-500 tw-text-white tw-font-bold"
                  : "hover:tw-bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Botón a la página siguiente */}
        <button
          title="Siguiente"
          disabled={page === array.length}
          onClick={() => callback(page + 1, false)}
          className="tw-p-2 tw-rounded-full tw-transition-colors hover:tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>

        {/* Botón a la última página */}
        <button
          title="Último"
          disabled={page === array.length}
          onClick={() => callback(array.length, false)}
          className="tw-p-2 tw-rounded-full tw-transition-colors hover:tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          <ChevronsRight size={20} />
        </button>

        {/* Botón para añadir nueva localidad */}
        <button
          title="Añadir Localidad Principal"
          onClick={() => setShowAddMainModal(true)}
          className="tw-ml-4 tw-p-2 tw-bg-blue-500 tw-text-white tw-rounded-full tw-transition-colors hover:tw-bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </nav>
    </div>
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
  const [showAddMainModal, setShowAddMainModal] = useState(false);
  const [mainName, setMainName] = useState("");

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
      setPage(page + 1);
    }
  }

  useEffect(() => {
    if (locations === undefined) dispatch(thunkGetLocations(id_plan));
  }, [locations, id_plan]);

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

  useEffect(() => {
    console.log('Estructura de locations_ (paginación):', locations_);
    console.log('Estructura de locations__ (paginación):', locations__);
  }, [locations_]);

  const handleModalSubmit = () => {
    // Crear nueva localidad principal localmente
    const newMain = {
      id_plan: id_plan,
      type: 'Localidad',
      name: mainName
    };
    // Copia el mapa actual o crea uno nuevo si es undefined
    const newMap = locationsMap ? new Map(locationsMap) : new Map();
    newMap.set(newMain, []);
    const newKeys = Array.from(newMap.keys());
    setLocationsMap(newMap);
    setLocations_(newKeys);
    // Buscar el índice de la nueva localidad principal y navegar a esa página
    const newIndex = newKeys.findIndex(loc => loc.name === mainName && loc.id_plan === id_plan);
    setPage(newIndex !== -1 ? newIndex + 1 : newKeys.length);
    setShowAddMainModal(false);
    setMainName("");
  };

  return loadingLocations ? (
    <p className="tw-text-center tw-mt-8">Cargando...</p>
  ) : (
    <div className="tw-flex tw-flex-col tw-justify-center tw-space-y-4">
      <Pagination array={locations_} page={page} callback={handlePage} setShowAddMainModal={setShowAddMainModal} />
      <LocationsForm 
        loc={locations_[page - 1]} 
        locs={locations__.length == 0 ? undefined : locations__} 
        currentLocationId={locations_[page - 1]?.id_location} 
      />
      {showAddMainModal && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-flex tw-items-center tw-justify-center tw-z-50"
          style={{ zIndex: 1000 }}
        >
          <div className="tw-bg-white tw-rounded-xl tw-shadow-2xl tw-p-8 tw-w-full tw-max-w-md tw-flex tw-flex-col tw-items-center">
            <h2 className="tw-text-xl tw-font-bold tw-mb-4">Agregar Localidad Principal</h2>
            <input
              type="text"
              value={mainName}
              onChange={e => setMainName(e.target.value)}
              placeholder="Nombre principal"
              className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-mb-4 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
            />
            <div className="tw-flex tw-gap-4">
              <button
                onClick={handleModalSubmit}
                className="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-green-600 tw-font-semibold"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddMainModal(false)}
                className="tw-bg-gray-300 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

