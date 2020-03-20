# react-webrtc-sample

Sample React.js (TypeScript) application demonstrated WebRTC API using for peer-to-peer video/voice call handling.

## Peer Server

The application works well with [this WebSocket based server](https://github.com/vitalydiachenko/webrtc-server-sample) but you can use another one following the same interface. 

## Peer-to-peer call establishing algorithm

### For Browser 1 (**B1**) and Browser 2 (**B2**) we have following steps:

1. **B1**, **B2**: Obtain and display (as local preview) local video stream.

1. **B1**: Create peer connection instance (`const peerConnection = new RTCPeerConnection`)

1. **B1**, **B2**: Implement `peerConnection.ontrack` event listeners for remote stream receiving ang processing locally.

1. **B1**: Create call offer (`RTCSessionDescriptionInit`) using `peerConnection.createOffer()`.

1. **B1**: Set peer connection local description using created offer (`peerConnection.setLocalDescription(offer)`).

1. **B1**: Send created offer to **B2** (using peer server).

1. **B2**: Receive call offer (`RTCSessionDescriptionInit`) and set the offer based remote description using `peerConnection.setRemoteDescription(offer)`

1. **B2**: Create peer connection answer (the type is also `RTCSessionDescriptionInit`) using `peerConnection.createAnswer()`.

1. **B2**: Create peer connection local description using created answer (`peerConnection.setLocalDescription(answer)`).

1. **B2**: Send created answer to **B1** (using peer server).

1. **B1**: Receive an answer from **B2**.

1. **B1**: Set peer connection remote description using received answer (`peerConnection.setRemoteDescription(answer);`).

1. **B1**, **B2**: Implement peer connections ICE candidates swapping and processing using `peerConnection.onicecandidate` event listeners for each peer connection and `peerConnection.addIceCandidate(candidate)` for not `null` ICE candidates adding to peer connection.

## Environment variables

- `HOST` - application port (`0.0.0.0` is default)

- `PORT` - application port (`3000` is default)

- `SOCKET_ENDPOINT` * - peer server endpoint

Variables marked with * are mandatory.

## Application Running

- Add environment variables to `.env`

- Run `yarn` for dependencies installing

- Run `yarn start` for application starting
