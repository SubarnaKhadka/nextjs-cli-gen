import React, { useState } from "react";

import * as ResizablePrimitive from "react-resizable-panels";

import FolderTree from "./FolderTree";
import { Input } from "./components/input";
import { useForm } from "react-hook-form";
import { capitalize, lowerCaseFirst } from "./utils";

const schematicsComp = {
  action: {
    path: {
      label: "Action Path: ",
      placeholder: "./actions",
    },
    name: {
      label: "Action Name: ",
      placeholder: "Action Name ( Default: action)",
      isRequired: false,
    },
  },
  page: {
    path: {
      label: "Page Path: ",
      placeholder: "./app",
    },
    name: {
      label: "Page Name: ",
      placeholder: "",
      isRequired: true,
    },
  },
  component: {
    path: {
      label: "Component Path: ",
      placeholder: "./components",
    },
    name: {
      label: "Component Name: ",
      placeholder: "",
      isRequired: true,
    },
  },
};

const App = () => {
  const form = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedSchematic, setSelectedSchematic] = useState("action");

  const [selectedComponentType, setSelectedComponentType] = useState("default");

  const [componentName, setComponentName] = useState();

  const onSubmit = async (values) => {
    setIsLoading(true);

    const { name, path, schemaName, formSchemaName, ...rest } = values;

    const dataTobeSend = {
      schematic: selectedSchematic,
      name,
      path: path || ".",
      schema: schemaName || "Schema",
    };

    if (selectedSchematic === "component") {
      dataTobeSend.props = rest;
      dataTobeSend.props.ctype = selectedComponentType;
      dataTobeSend.props.schemaName = formSchemaName || "Schema";
    }

    const response = await fetch("/exec-cmd", {
      method: "POST",
      body: JSON.stringify(dataTobeSend, (key, value) => {
        if (typeof value === "string" && value === "") {
          return undefined;
        }
        return value;
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.dispatchEvent(new CustomEvent("refetchTree"));
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <ResizablePrimitive.PanelGroup
        className="flex min-h-screen w-full data-[panel-group-direction=vertical]:flex-col"
        direction="horizontal"
      >
        <ResizablePrimitive.Panel defaultSize={75} minSize={25}>
          <div className="p-4">
            <div className="text-2xl font-medium text-slate-700 underline underline-offset-2">
              nextjs-cli-gen - Next Command Line Interface
            </div>
            <p className="mt-8 text-xl font-medium text-slate-800 underline underline-offset-2">
              Choose Schematic
            </p>
            <div className="mt-5 space-y-5">
              <div class="flex gap-10">
                {["action", "page", "component"].map((schematic) => (
                  <div key={schematic} class="inline-flex items-center">
                    <label
                      class="relative flex items-center cursor-pointer"
                      for={schematic}
                    >
                      <input
                        name="schematic"
                        type="radio"
                        checked={schematic === selectedSchematic}
                        onChange={() => setSelectedSchematic(schematic)}
                        class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                        id={schematic}
                      />
                      <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label
                      class="ml-2 cursor-pointer text-base transform capitalize"
                      for={schematic}
                    >
                      {schematic}
                    </label>
                  </div>
                ))}
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2.5 items-center">
                    <label htmlFor="path">
                      {schematicsComp[selectedSchematic].path.label}
                    </label>
                    <Input
                      {...form.register("path")}
                      id="path"
                      className="max-w-sm"
                      placeholder={
                        schematicsComp[selectedSchematic].path.placeholder
                      }
                    />
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <label htmlFor="name">
                      {schematicsComp[selectedSchematic].name.label}
                    </label>
                    <Input
                      required={
                        schematicsComp[selectedSchematic].name.isRequired
                      }
                      {...form.register("name")}
                      id="name"
                      onChange={(e) => setComponentName(e.target.value)}
                      className="max-w-sm"
                      placeholder={
                        schematicsComp[selectedSchematic].name.placeholder
                      }
                    />
                  </div>

                  {selectedSchematic === "action" && (
                    <div className="flex gap-2.5 items-center">
                      <label htmlFor="schemaName">Schema Name: </label>
                      <Input
                        {...form.register("schemaName")}
                        id="schema-name"
                        className="max-w-sm"
                        placeholder="schema Name ( Default: Schema)"
                      />
                    </div>
                  )}

                  {selectedSchematic === "component" && (
                    <>
                      <div className="flex gap-10">
                        {["default", "form"].map((cType) => (
                          <div key={cType} class="inline-flex items-center">
                            <label
                              class="relative flex items-center cursor-pointer"
                              for={cType}
                            >
                              <input
                                name="cType"
                                type="radio"
                                checked={cType === selectedComponentType}
                                onChange={() => setSelectedComponentType(cType)}
                                class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                                id={cType}
                              />
                              <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                            </label>
                            <label
                              class="ml-2 cursor-pointer text-base transform capitalize"
                              for={cType}
                            >
                              {cType}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedComponentType === "form" && (
                        <div className="space-y-5">
                          <div className="flex gap-2.5 items-center">
                            <label htmlFor="form-fields">
                              What are the form fields?
                            </label>
                            <Input
                              {...form.register("fields")}
                              required
                              id="form-fields"
                              className="max-w-sm"
                              placeholder="email, password"
                            />
                          </div>

                          <div className="flex gap-2.5 items-center">
                            <label htmlFor="form-schema-name">
                              What's your schema name?
                            </label>
                            <Input
                              {...form.register("formSchemaName")}
                              required
                              id="form-schema-name"
                              className="max-w-sm"
                              value={
                                componentName
                                  ? `${capitalize(componentName)}Schema`
                                  : ""
                              }
                            />
                          </div>

                          <div className="flex gap-2.5 items-center">
                            <label htmlFor="schema-paths">
                              What's your schema path?
                            </label>
                            <Input
                              {...form.register("schemaPath")}
                              required
                              id="schema-paths"
                              className="max-w-sm"
                              value={
                                componentName
                                  ? `./schemas/${lowerCaseFirst(
                                      componentName
                                    )}.schema.ts`
                                  : ""
                              }
                            />
                          </div>

                          <div className="flex gap-2.5 items-center">
                            <label htmlFor="action-name">
                              What's your action name?
                            </label>
                            <Input
                              {...form.register("actionName")}
                              required
                              id="action-name"
                              className="max-w-sm"
                              value={
                                componentName
                                  ? `${lowerCaseFirst(componentName)}Action`
                                  : ""
                              }
                            />
                          </div>

                          <div className="flex gap-2.5 items-center">
                            <label htmlFor="action-path">
                              What's your action path?
                            </label>
                            <Input
                              {...form.register("actionPath")}
                              required
                              id="action-path"
                              className="max-w-sm"
                              value={
                                componentName
                                  ? `./actions/${lowerCaseFirst(
                                      componentName
                                    )}.action.ts`
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
                >
                  Generate
                </button>
              </form>
            </div>
          </div>
        </ResizablePrimitive.Panel>

        <ResizablePrimitive.PanelResizeHandle className="relative flex w-px items-center justify-center bg-gray-300 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90" />

        <ResizablePrimitive.Panel defaultSize={25} minSize={15}>
          <FolderTree />
        </ResizablePrimitive.Panel>
      </ResizablePrimitive.PanelGroup>
    </div>
  );
};

export default App;
