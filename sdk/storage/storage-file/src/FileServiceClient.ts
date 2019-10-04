// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AbortSignalLike } from "@azure/abort-controller";
import * as Models from "./generated/src/models";
import { Service } from "./generated/src/operations";
import { newPipeline, NewPipelineOptions, Pipeline } from "./Pipeline";
import { StorageClient, CommonOptions } from "./StorageClient";
import { ShareClient, ShareCreateOptions, ShareDeleteMethodOptions } from "./ShareClient";
import { appendToURLPath, extractConnectionStringParts } from "./utils/utils.common";
import { Credential } from "./credentials/Credential";
import { SharedKeyCredential } from "./credentials/SharedKeyCredential";
import { AnonymousCredential } from "./credentials/AnonymousCredential";
import "@azure/core-paging";
import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { isNode } from "@azure/core-http";
import { CanonicalCode } from "@azure/core-tracing";
import { createSpan } from "./utils/tracing";

/**
 * Options to configure List Shares Segment operation.
 *
 * @interface ServiceListSharesSegmentOptions
 */
interface ServiceListSharesSegmentOptions extends CommonOptions {
  /**
   * An implementation of the `AbortSignalLike` interface to signal the request to cancel the operation.
   * For example, use the &commat;azure/abort-controller to create an `AbortSignal`.
   *
   * @type {AbortSignalLike}
   * @memberof ServiceListSharesSegmentOptions
   */
  abortSignal?: AbortSignalLike;
  /**
   * Filters the results to return only entries whose
   * name begins with the specified prefix.
   *
   * @type {string}
   * @memberof ServiceListSharesSegmentOptions
   */
  prefix?: string;

  /**
   * Specifies the maximum number of entries to
   * return. If the request does not specify maxresults, or specifies a value
   * greater than 5,000, the server will return up to 5,000 items.
   *
   * @type {number}
   * @memberof ServiceListSharesSegmentOptions
   */
  maxresults?: number;

  /**
   * Include this parameter to
   * specify one or more datasets to include in the response.
   *
   * @type {Models.ListSharesIncludeType[]}
   * @memberof ServiceListSharesSegmentOptions
   */
  include?: Models.ListSharesIncludeType[];
}

/**
 * Options to configure List Shares operation.
 *
 * @export
 * @interface ServiceListSharesOptions
 */
export interface ServiceListSharesOptions extends CommonOptions {
  /**
   * An implementation of the `AbortSignalLike` interface to signal the request to cancel the operation.
   * For example, use the &commat;azure/abort-controller to create an `AbortSignal`.
   *
   * @type {AbortSignalLike}
   * @memberof ServiceListSharesOptions
   */
  abortSignal?: AbortSignalLike;
  /**
   * Filters the results to return only entries whose
   * name begins with the specified prefix.
   *
   * @type {string}
   * @memberof ServiceListSharesOptions
   */
  prefix?: string;
  /**
   * Include this parameter to
   * specify one or more datasets to include in the response.
   *
   * @type {Models.ListSharesIncludeType[]}
   * @memberof ServiceListSharesSegmentOptions
   */
  include?: Models.ListSharesIncludeType[];
}

/**
 * Options to configure File Service - Get Properties operation.
 *
 * @export
 * @interface ServiceGetPropertiesOptions
 */
export interface ServiceGetPropertiesOptions extends CommonOptions {
  /**
   * An implementation of the `AbortSignalLike` interface to signal the request to cancel the operation.
   * For example, use the &commat;azure/abort-controller to create an `AbortSignal`.
   *
   * @type {AbortSignalLike}
   * @memberof AppendBlobCreateOptions
   */
  abortSignal?: AbortSignalLike;
}

/**
 * Options to configure File Service - Set Properties operation.
 *
 * @export
 * @interface ServiceSetPropertiesOptions
 */
export interface ServiceSetPropertiesOptions extends CommonOptions {
  /**
   * An implementation of the `AbortSignalLike` interface to signal the request to cancel the operation.
   * For example, use the &commat;azure/abort-controller to create an `AbortSignal`.
   *
   * @type {AbortSignalLike}
   * @memberof AppendBlobCreateOptions
   */
  abortSignal?: AbortSignalLike;
}

/**
 * A FileServiceClient represents a URL to the Azure Storage File service allowing you
 * to manipulate file shares.
 *
 * @export
 * @class FileServiceClient
 */
export class FileServiceClient extends StorageClient {
  /**
   * serviceContext provided by protocol layer.
   *
   * @private
   * @type {Service}
   * @memberof FileServiceClient
   */
  private serviceContext: Service;

  /**
   *
   * Creates an instance of FileServiceClient from connection string.
   *
   * @param {string} connectionString Account connection string or a SAS connection string of an Azure storage account.
   *                                  [ Note - Account connection string can only be used in NODE.JS runtime. ]
   *                                  Account connection string example -
   *                                  `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net`
   *                                  SAS connection string example -
   *                                  `BlobEndpoint=https://myaccount.blob.core.windows.net/;QueueEndpoint=https://myaccount.queue.core.windows.net/;FileEndpoint=https://myaccount.file.core.windows.net/;TableEndpoint=https://myaccount.table.core.windows.net/;SharedAccessSignature=sasString`
   * @param {NewPipelineOptions} [options] Options to configure the HTTP pipeline.
   * @returns {FileServiceClient} A new FileServiceClient from the given connection string.
   * @memberof FileServiceClient
   */
  public static fromConnectionString(
    connectionString: string,
    options?: NewPipelineOptions
  ): FileServiceClient {
    const extractedCreds = extractConnectionStringParts(connectionString);
    if (extractedCreds.kind === "AccountConnString") {
      if (isNode) {
        const sharedKeyCredential = new SharedKeyCredential(
          extractedCreds.accountName!,
          extractedCreds.accountKey
        );
        const pipeline = newPipeline(sharedKeyCredential, options);
        return new FileServiceClient(extractedCreds.url, pipeline);
      } else {
        throw new Error("Account connection string is only supported in Node.js environment");
      }
    } else if (extractedCreds.kind === "SASConnString") {
      const pipeline = newPipeline(new AnonymousCredential(), options);
      return new FileServiceClient(extractedCreds.url + "?" + extractedCreds.accountSas, pipeline);
    } else {
      throw new Error(
        "Connection string must be either an Account connection string or a SAS connection string"
      );
    }
  }

  /**
   * Creates an instance of FileServiceClient.
   *
   * @param {string} url A URL string pointing to Azure Storage file service, such as
   *                     "https://myaccount.file.core.windows.net". You can Append a SAS
   *                     if using AnonymousCredential, such as "https://myaccount.file.core.windows.net?sasString".
   * @param {Credential} [credential] Such as AnonymousCredential, SharedKeyCredential or TokenCredential.
   *                                  If not specified, AnonymousCredential is used.
   * @param {NewPipelineOptions} [options] Optional. Options to configure the HTTP pipeline.
   * @memberof FileServiceClient
   */
  constructor(url: string, credential?: Credential, options?: NewPipelineOptions);
  /**
   * Creates an instance of FileServiceClient.
   *
   * @param {string} url A URL string pointing to Azure Storage file service, such as
   *                     "https://myaccount.file.core.windows.net". You can Append a SAS
   *                     if using AnonymousCredential, such as "https://myaccount.file.core.windows.net?sasString".
   * @param {Pipeline} pipeline Call newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof FileServiceClient
   */
  constructor(url: string, pipeline: Pipeline);
  constructor(
    url: string,
    credentialOrPipeline?: Credential | Pipeline,
    options?: NewPipelineOptions
  ) {
    let pipeline: Pipeline;
    if (credentialOrPipeline instanceof Pipeline) {
      pipeline = credentialOrPipeline;
    } else if (credentialOrPipeline instanceof Credential) {
      pipeline = newPipeline(credentialOrPipeline, options);
    } else {
      // The second parameter is undefined. Use anonymous credential.
      pipeline = newPipeline(new AnonymousCredential(), options);
    }

    super(url, pipeline);
    this.serviceContext = new Service(this.storageClientContext);
  }

  /**
   * Creates a ShareClient object.
   *
   * @param shareName Name of a share.
   * @returns {ShareClient} The ShareClient object for the given share name.
   * @memberof FileServiceClient
   */
  public getShareClient(shareName: string): ShareClient {
    return new ShareClient(appendToURLPath(this.url, shareName), this.pipeline);
  }

  /**
   * Creates a Share.
   *
   * @param {string} shareName
   * @param {ShareCreateOptions} [options]
   * @returns {Promise<{ shareCreateResponse: Models.ShareCreateResponse, shareClient: ShareClient }>} Share creation response and the corresponding share client.
   * @memberof FileServiceClient
   */
  public async createShare(
    shareName: string,
    options: ShareCreateOptions = {}
  ): Promise<{ shareCreateResponse: Models.ShareCreateResponse; shareClient: ShareClient }> {
    const { span, spanOptions } = createSpan("FileServiceClient-createShare", options.spanOptions);
    try {
      const shareClient = this.getShareClient(shareName);
      const shareCreateResponse = await shareClient.create({ ...options, spanOptions });
      return {
        shareCreateResponse,
        shareClient
      };
    } catch (e) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Deletes a Share.
   *
   * @param {string} shareName
   * @param {ShareDeleteMethodOptions} [options]
   * @returns {Promise<Models.ShareDeleteResponse>} Share deletion response and the corresponding share client.
   * @memberof FileServiceClient
   */
  public async deleteShare(
    shareName: string,
    options: ShareDeleteMethodOptions = {}
  ): Promise<Models.ShareDeleteResponse> {
    const { span, spanOptions } = createSpan("FileServiceClient-deleteShare", options.spanOptions);
    try {
      const shareClient = this.getShareClient(shareName);
      return await shareClient.delete({ ...options, spanOptions });
    } catch (e) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Gets the properties of a storage account’s file service, including properties
   * for Storage Analytics and CORS (Cross-Origin Resource Sharing) rules.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-file-service-properties}
   *
   * @param {ServiceGetPropertiesOptions} [options={}] Options to Get Properties operation.
   * @returns {Promise<Models.ServiceGetPropertiesResponse>} Response data for the Get Properties operation.
   * @memberof FileServiceClient
   */
  public async getProperties(
    options: ServiceGetPropertiesOptions = {}
  ): Promise<Models.ServiceGetPropertiesResponse> {
    const { span, spanOptions } = createSpan(
      "FileServiceClient-getProperties",
      options.spanOptions
    );
    try {
      return this.serviceContext.getProperties({
        abortSignal: options.abortSignal,
        spanOptions
      });
    } catch (e) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Sets properties for a storage account’s file service endpoint, including properties
   * for Storage Analytics, CORS (Cross-Origin Resource Sharing) rules and soft delete settings.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-file-service-properties}
   *
   * @param {Models.StorageServiceProperties} properties
   * @param {ServiceSetPropertiesOptions} [options={}] Options to Set Properties operation.
   * @returns {Promise<Models.ServiceSetPropertiesResponse>} Response data for the Set Properties operation.
   * @memberof FileServiceClient
   */
  public async setProperties(
    properties: Models.StorageServiceProperties,
    options: ServiceSetPropertiesOptions = {}
  ): Promise<Models.ServiceSetPropertiesResponse> {
    const { span, spanOptions } = createSpan(
      "FileServiceClient-setProperties",
      options.spanOptions
    );
    try {
      return this.serviceContext.setProperties(properties, {
        abortSignal: options.abortSignal,
        spanOptions
      });
    } catch (e) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Returns an AsyncIterableIterator for ServiceListSharesSegmentResponses
   *
   * @private
   * @param {string} [marker] A string value that identifies the portion of
   *                          the list of shares to be returned with the next listing operation. The
   *                          operation returns the NextMarker value within the response body if the
   *                          listing operation did not return all shares remaining to be listed
   *                          with the current page. The NextMarker value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param {ServiceListSharesSegmentOptions} [options] Options to list shares operation.
   * @returns {AsyncIterableIterator<Models.ServiceListSharesSegmentResponse>}
   * @memberof FileServiceClient
   */
  private async *listSegments(
    marker?: string,
    options: ServiceListSharesSegmentOptions = {}
  ): AsyncIterableIterator<Models.ServiceListSharesSegmentResponse> {
    let listSharesSegmentResponse;
    do {
      listSharesSegmentResponse = await this.listSharesSegment(marker, options);
      marker = listSharesSegmentResponse.nextMarker;
      yield await listSharesSegmentResponse;
    } while (marker);
  }

  /**
   * Returns an AsyncIterableIterator for share items
   *
   * @private
   * @param {ServiceListSharesSegmentOptions} [options] Options to list shares operation.
   * @returns {AsyncIterableIterator<Models.ServiceListSharesSegmentResponse>}
   * @memberof FileServiceClient
   */
  private async *listItems(
    options: ServiceListSharesSegmentOptions = {}
  ): AsyncIterableIterator<Models.ShareItem> {
    let marker: string | undefined;
    for await (const segment of this.listSegments(marker, options)) {
      yield* segment.shareItems;
    }
  }

  /**
   * Returns an async iterable iterator to list all the shares
   * under the specified account.
   *
   * .byPage() returns an async iterable iterator to list the shares in pages.
   *
   * @example
   * ```js
   *   let i = 1;
   *   for await (const share of serviceClient.listShares()) {
   *     console.log(`Share ${i++}: ${share.name}`);
   *   }
   * ```
   *
   * @example
   * ```js
   *   // Generator syntax .next()
   *   let i = 1;
   *   let iter = await serviceClient.listShares();
   *   let shareItem = await iter.next();
   *   while (!shareItem.done) {
   *     console.log(`Share ${i++}: ${shareItem.value.name}`);
   *     shareItem = await iter.next();
   *   }
   * ```
   *
   * @example
   * ```js
   *   // Example for .byPage()
   *   // passing optional maxPageSize in the page settings
   *   let i = 1;
   *   for await (const response of serviceClient.listShares().byPage({ maxPageSize: 20 })) {
   *     if (response.shareItems) {
   *       for (const share of response.shareItems) {
   *         console.log(`Share ${i++}: ${share.name}`);
   *       }
   *     }
   *   }
   * ```
   *
   * @example
   * ```js
   *   // Passing marker as an argument (similar to the previous example)
   *   let i = 1;
   *   let iterator = serviceClient.listShares().byPage({ maxPageSize: 2 });
   *   let response = (await iterator.next()).value;
   *   // Prints 2 share names
   *   if (response.shareItems) {
   *     for (const share of response.shareItems) {
   *       console.log(`Share ${i++}: ${share.name}`);
   *     }
   *   }
   *   // Gets next marker
   *   let marker = response.nextMarker;
   *   // Passing next marker as continuationToken
   *   iterator = serviceClient.listShares().byPage({ continuationToken: marker, maxPageSize: 10 });
   *   response = (await iterator.next()).value;
   *   // Prints 10 share names
   *   if (response.shareItems) {
   *     for (const share of response.shareItems) {
   *       console.log(`Share ${i++}: ${share.name}`);
   *     }
   *   }
   * ```
   *
   * @param {ServiceListSharesOptions} [options] Options to list shares operation.
   * @memberof FileServiceClient
   * @returns {PagedAsyncIterableIterator<Models.ShareItem, Models.ServiceListSharesSegmentResponse>}
   * An asyncIterableIterator that supports paging.
   */
  public listShares(
    options: ServiceListSharesOptions = {}
  ): PagedAsyncIterableIterator<Models.ShareItem, Models.ServiceListSharesSegmentResponse> {
    // AsyncIterableIterator to iterate over queues
    const iter = this.listItems(options);
    return {
      /**
       * @member {Promise} [next] The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * @member {Symbol} [asyncIterator] The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * @member {Function} [byPage] Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings: PageSettings = {}) => {
        return this.listSegments(settings.continuationToken, {
          maxresults: settings.maxPageSize,
          ...options
        });
      }
    };
  }

  /**
   * Gets the properties of a storage account's File service, including properties for Storage
   * Analytics metrics and CORS (Cross-Origin Resource Sharing) rules.
   *
   * @param {string} [marker] A string value that identifies the portion of
   *                          the list to be returned with the next list operation. The operation
   *                          returns a marker value within the response body if the list returned was
   *                          not complete. The marker value may then be used in a subsequent call to
   *                          request the next set of list items. The marker value is opaque to the
   *                          client.
   * @param {ServiceListSharesSegmentOptions} [options={}] Options to List Shares Segment operation.
   * @returns {Promise<Models.ServiceListSharesSegmentResponse>} Response data for the List Shares Segment operation.
   * @memberof FileServiceClient
   */
  private async listSharesSegment(
    marker?: string,
    options: ServiceListSharesSegmentOptions = {}
  ): Promise<Models.ServiceListSharesSegmentResponse> {
    const { span, spanOptions } = createSpan(
      "FileServiceClient-listSharesSegment",
      options.spanOptions
    );
    try {
      return this.serviceContext.listSharesSegment({
        marker,
        ...options,
        spanOptions
      });
    } catch (e) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }
}
