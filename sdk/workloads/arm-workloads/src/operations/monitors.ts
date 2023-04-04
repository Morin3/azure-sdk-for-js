/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { Monitors } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { WorkloadsClient } from "../workloadsClient";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  Monitor,
  MonitorsListNextOptionalParams,
  MonitorsListOptionalParams,
  MonitorsListResponse,
  MonitorsListByResourceGroupNextOptionalParams,
  MonitorsListByResourceGroupOptionalParams,
  MonitorsListByResourceGroupResponse,
  MonitorsGetOptionalParams,
  MonitorsGetResponse,
  MonitorsCreateOptionalParams,
  MonitorsCreateResponse,
  MonitorsDeleteOptionalParams,
  MonitorsDeleteResponse,
  UpdateMonitorRequest,
  MonitorsUpdateOptionalParams,
  MonitorsUpdateResponse,
  MonitorsListNextResponse,
  MonitorsListByResourceGroupNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Monitors operations. */
export class MonitorsImpl implements Monitors {
  private readonly client: WorkloadsClient;

  /**
   * Initialize a new instance of the class Monitors class.
   * @param client Reference to the service client
   */
  constructor(client: WorkloadsClient) {
    this.client = client;
  }

  /**
   * Gets a list of SAP monitors in the specified subscription. The operations returns various properties
   * of each SAP monitor.
   * @param options The options parameters.
   */
  public list(
    options?: MonitorsListOptionalParams
  ): PagedAsyncIterableIterator<Monitor> {
    const iter = this.listPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listPagingPage(options, settings);
      }
    };
  }

  private async *listPagingPage(
    options?: MonitorsListOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Monitor[]> {
    let result: MonitorsListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    options?: MonitorsListOptionalParams
  ): AsyncIterableIterator<Monitor> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Gets a list of SAP monitors in the specified resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    options?: MonitorsListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<Monitor> {
    const iter = this.listByResourceGroupPagingAll(resourceGroupName, options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listByResourceGroupPagingPage(
          resourceGroupName,
          options,
          settings
        );
      }
    };
  }

  private async *listByResourceGroupPagingPage(
    resourceGroupName: string,
    options?: MonitorsListByResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Monitor[]> {
    let result: MonitorsListByResourceGroupResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByResourceGroup(resourceGroupName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByResourceGroupNext(
        resourceGroupName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByResourceGroupPagingAll(
    resourceGroupName: string,
    options?: MonitorsListByResourceGroupOptionalParams
  ): AsyncIterableIterator<Monitor> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Gets a list of SAP monitors in the specified subscription. The operations returns various properties
   * of each SAP monitor.
   * @param options The options parameters.
   */
  private _list(
    options?: MonitorsListOptionalParams
  ): Promise<MonitorsListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * Gets a list of SAP monitors in the specified resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    options?: MonitorsListByResourceGroupOptionalParams
  ): Promise<MonitorsListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listByResourceGroupOperationSpec
    );
  }

  /**
   * Gets properties of a SAP monitor for the specified subscription, resource group, and resource name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    monitorName: string,
    options?: MonitorsGetOptionalParams
  ): Promise<MonitorsGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, monitorName, options },
      getOperationSpec
    );
  }

  /**
   * Creates a SAP monitor for the specified subscription, resource group, and resource name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param monitorParameter Request body representing a SAP monitor
   * @param options The options parameters.
   */
  async beginCreate(
    resourceGroupName: string,
    monitorName: string,
    monitorParameter: Monitor,
    options?: MonitorsCreateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<MonitorsCreateResponse>,
      MonitorsCreateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<MonitorsCreateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, monitorName, monitorParameter, options },
      spec: createOperationSpec
    });
    const poller = await createHttpPoller<
      MonitorsCreateResponse,
      OperationState<MonitorsCreateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Creates a SAP monitor for the specified subscription, resource group, and resource name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param monitorParameter Request body representing a SAP monitor
   * @param options The options parameters.
   */
  async beginCreateAndWait(
    resourceGroupName: string,
    monitorName: string,
    monitorParameter: Monitor,
    options?: MonitorsCreateOptionalParams
  ): Promise<MonitorsCreateResponse> {
    const poller = await this.beginCreate(
      resourceGroupName,
      monitorName,
      monitorParameter,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Deletes a SAP monitor with the specified subscription, resource group, and SAP monitor name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    monitorName: string,
    options?: MonitorsDeleteOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<MonitorsDeleteResponse>,
      MonitorsDeleteResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<MonitorsDeleteResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, monitorName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<
      MonitorsDeleteResponse,
      OperationState<MonitorsDeleteResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Deletes a SAP monitor with the specified subscription, resource group, and SAP monitor name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    monitorName: string,
    options?: MonitorsDeleteOptionalParams
  ): Promise<MonitorsDeleteResponse> {
    const poller = await this.beginDelete(
      resourceGroupName,
      monitorName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Patches the Tags field of a SAP monitor for the specified subscription, resource group, and SAP
   * monitor name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param monitorName Name of the SAP monitor resource.
   * @param body The Update SAP workload monitor request body.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    monitorName: string,
    body: UpdateMonitorRequest,
    options?: MonitorsUpdateOptionalParams
  ): Promise<MonitorsUpdateResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, monitorName, body, options },
      updateOperationSpec
    );
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: MonitorsListNextOptionalParams
  ): Promise<MonitorsListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec
    );
  }

  /**
   * ListByResourceGroupNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param nextLink The nextLink from the previous successful call to the ListByResourceGroup method.
   * @param options The options parameters.
   */
  private _listByResourceGroupNext(
    resourceGroupName: string,
    nextLink: string,
    options?: MonitorsListByResourceGroupNextOptionalParams
  ): Promise<MonitorsListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listByResourceGroupNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.Workloads/monitors",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MonitorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Workloads/monitors",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MonitorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Workloads/monitors/{monitorName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Monitor
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.monitorName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Workloads/monitors/{monitorName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Monitor
    },
    201: {
      bodyMapper: Mappers.Monitor
    },
    202: {
      bodyMapper: Mappers.Monitor
    },
    204: {
      bodyMapper: Mappers.Monitor
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.monitorParameter,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.monitorName
  ],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Workloads/monitors/{monitorName}",
  httpMethod: "DELETE",
  responses: {
    200: {
      bodyMapper: Mappers.OperationStatusResult
    },
    201: {
      bodyMapper: Mappers.OperationStatusResult
    },
    202: {
      bodyMapper: Mappers.OperationStatusResult
    },
    204: {
      bodyMapper: Mappers.OperationStatusResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.monitorName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Workloads/monitors/{monitorName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.Monitor
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.body9,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.monitorName
  ],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MonitorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MonitorListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
