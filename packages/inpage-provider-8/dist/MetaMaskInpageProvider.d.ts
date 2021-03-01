/// <reference types="node" />
import { Duplex } from 'stream';
import { JsonRpcRequest, JsonRpcResponse } from 'json-rpc-engine';
import SafeEventEmitter from '@metamask/safe-event-emitter';
import { ConsoleLike, Maybe } from './utils';
export interface MetaMaskInpageProviderOptions {
    /**
     * The name of the stream used to connect to the wallet.
     */
    jsonRpcStreamName?: string;
    /**
     * The logging API to use.
     */
    logger?: ConsoleLike;
    /**
     * The maximum number of event listeners.
     */
    maxEventListeners?: number;
    /**
     * Whether the provider should send page metadata.
     */
    shouldSendMetadata?: boolean;
}
export interface RequestArguments {
    /** The RPC method to request. */
    method: string;
    /** The params of the RPC method, if any. */
    params?: unknown[] | Record<string, unknown>;
}
export interface SendSyncJsonRpcRequest extends JsonRpcRequest<unknown> {
    method: 'eth_accounts' | 'eth_coinbase' | 'eth_uninstallFilter' | 'net_version';
}
export default class MetaMaskInpageProvider extends SafeEventEmitter {
    private readonly _log;
    private _state;
    private _rpcEngine;
    /**
     * The chain ID of the currently connected Ethereum chain.
     * See [chainId.network]{@link https://chainid.network} for more information.
     */
    chainId: string | null;
    /**
     * The network ID of the currently connected Ethereum chain.
     * @deprecated Use {@link chainId} instead.
     */
    networkVersion: string | null;
    /**
     * The user's currently selected Ethereum address.
     * If null, MetaMask is either locked or the user has not permitted any
     * addresses to be viewed.
     */
    selectedAddress: string | null;
    /**
     * Indicating that this provider is a MetaMask provider.
     */
    readonly isMetaMask: true;
    /**
     * Experimental methods can be found here.
     */
    readonly _metamask: ReturnType<MetaMaskInpageProvider['_getExperimentalApi']>;
    /**
     * @param connectionStream - A Node.js duplex stream
     * @param options - An options bag
     * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
     * Default: metamask-provider
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     * @param options.shouldSendMetadata - Whether the provider should
     * send page metadata. Default: true
     */
    constructor(connectionStream: typeof Duplex, { jsonRpcStreamName, logger, maxEventListeners, shouldSendMetadata, }?: MetaMaskInpageProviderOptions);
    /**
     * Returns whether the provider can process RPC requests.
     */
    isConnected(): boolean;
    /**
     * Submits an RPC request for the given method, with the given params.
     * Resolves with the result of the method call, or rejects on error.
     *
     * @param args - The RPC request arguments.
     * @param args.method - The RPC method name.
     * @param args.params - The parameters for the RPC method.
     * @returns A Promise that resolves with the result of the RPC method,
     * or rejects if an error is encountered.
     */
    request<T>(args: RequestArguments): Promise<Maybe<T>>;
    /**
     * Submits an RPC request per the given JSON-RPC request object.
     *
     * @param payload - The RPC request object.
     * @param cb - The callback function.
     */
    sendAsync(payload: JsonRpcRequest<unknown>, callback: (error: Error | null, result?: JsonRpcResponse<unknown>) => void): void;
    /**
     * We override the following event methods so that we can warn consumers
     * about deprecated events:
     *   addListener, on, once, prependListener, prependOnceListener
     */
    addListener(eventName: string, listener: (...args: unknown[]) => void): this;
    on(eventName: string, listener: (...args: unknown[]) => void): this;
    once(eventName: string, listener: (...args: unknown[]) => void): this;
    prependListener(eventName: string, listener: (...args: unknown[]) => void): this;
    prependOnceListener(eventName: string, listener: (...args: unknown[]) => void): this;
    /**
     * Constructor helper.
     * Populates initial state by calling 'metamask_getProviderState' and emits
     * necessary events.
     */
    private _initializeState;
    /**
     * Internal RPC method. Forwards requests to background via the RPC engine.
     * Also remap ids inbound and outbound.
     *
     * @param payload - The RPC request object.
     * @param callback - The consumer's callback.
     */
    private _rpcRequest;
    /**
     * When the provider becomes connected, updates internal state and emits
     * required events. Idempotent.
     *
     * @param chainId - The ID of the newly connected chain.
     * @emits MetaMaskInpageProvider#connect
     */
    private _handleConnect;
    /**
     * When the provider becomes disconnected, updates internal state and emits
     * required events. Idempotent with respect to the isRecoverable parameter.
     *
     * Error codes per the CloseEvent status codes as required by EIP-1193:
     * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
     *
     * @param isRecoverable - Whether the disconnection is recoverable.
     * @param errorMessage - A custom error message.
     * @emits MetaMaskInpageProvider#disconnect
     */
    private _handleDisconnect;
    /**
     * Called when connection is lost to critical streams.
     *
     * @emits MetamaskInpageProvider#disconnect
     */
    private _handleStreamDisconnect;
    /**
     * Upon receipt of a new chainId and networkVersion, emits corresponding
     * events and sets relevant public state.
     * Does nothing if neither the chainId nor the networkVersion are different
     * from existing values.
     *
     * @emits MetamaskInpageProvider#chainChanged
     * @param networkInfo - An object with network info.
     * @param networkInfo.chainId - The latest chain ID.
     * @param networkInfo.networkVersion - The latest network ID.
     */
    private _handleChainChanged;
    /**
     * Called when accounts may have changed. Diffs the new accounts value with
     * the current one, updates all state as necessary, and emits the
     * accountsChanged event.
     *
     * @param accounts - The new accounts value.
     * @param isEthAccounts - Whether the accounts value was returned by
     * a call to eth_accounts.
     */
    private _handleAccountsChanged;
    /**
     * Upon receipt of a new isUnlocked state, sets relevant public state.
     * Calls the accounts changed handler with the received accounts, or an empty
     * array.
     *
     * Does nothing if the received value is equal to the existing value.
     * There are no lock/unlock events.
     *
     * @param opts - Options bag.
     * @param opts.accounts - The exposed accounts, if any.
     * @param opts.isUnlocked - The latest isUnlocked value.
     */
    private _handleUnlockStateChanged;
    /**
     * Warns of deprecation for the given event, if applicable.
     */
    private _warnOfDeprecation;
    /**
     * Constructor helper.
     * Gets experimental _metamask API as Proxy, so that we can warn consumers
     * about its experiment nature.
     */
    private _getExperimentalApi;
    /**
     * Equivalent to: ethereum.request('eth_requestAccounts')
     *
     * @deprecated Use request({ method: 'eth_requestAccounts' }) instead.
     * @returns A promise that resolves to an array of addresses.
     */
    enable(): Promise<string[]>;
    /**
     * Submits an RPC request for the given method, with the given params.
     *
     * @deprecated Use "request" instead.
     * @param method - The method to request.
     * @param params - Any params for the method.
     * @returns A Promise that resolves with the JSON-RPC response object for the
     * request.
     */
    send<T>(method: string, params?: T[]): Promise<JsonRpcResponse<T>>;
    /**
     * Submits an RPC request per the given JSON-RPC request object.
     *
     * @deprecated Use "request" instead.
     * @param payload - A JSON-RPC request object.
     * @param callback - An error-first callback that will receive the JSON-RPC
     * response object.
     */
    send<T>(payload: JsonRpcRequest<unknown>, callback: (error: Error | null, result?: JsonRpcResponse<T>) => void): void;
    /**
     * Accepts a JSON-RPC request object, and synchronously returns the cached result
     * for the given method. Only supports 4 specific RPC methods.
     *
     * @deprecated Use "request" instead.
     * @param payload - A JSON-RPC request object.
     * @returns A JSON-RPC response object.
     */
    send<T>(payload: SendSyncJsonRpcRequest): JsonRpcResponse<T>;
    /**
     * Internal backwards compatibility method, used in send.
     *
     * @deprecated
     */
    private _sendSync;
}
