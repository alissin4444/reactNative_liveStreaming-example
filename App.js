import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Button,
} from 'react-native';

import {NodeCameraView} from 'react-native-nodemediaclient';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ],
      {
        title: 'Cool Photo App Camera And Microphone Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  const [state, setState] = useState({
    publishBtnTitle: 'Start Publish',
    isPublish: false,
  });

  const vbRef = useRef(null);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <NodeCameraView
          style={{height: 400}}
          ref={(vb) => {
            vbRef.current = vb;
          }}
          outputUrl={
            'rtmp://live.mux.com/app/c207b516-280f-4527-f8dd-5b00c039a8f6'
          }
          camera={{cameraId: 1, cameraFrontMirror: true}}
          audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
          video={{
            preset: 12,
            bitrate: 400000,
            profile: 1,
            fps: 15,
            videoFrontMirror: false,
          }}
          autopreview={true}
        />

        <Button title="request permissions" onPress={requestCameraPermission} />
        <Button
          onPress={() => {
            if (state.isPublish) {
              setState({
                publishBtnTitle: 'Start Publish',
                isPublish: false,
              });
              vbRef.current.stop();
            } else {
              setState({publishBtnTitle: 'Stop Publish', isPublish: true});
              vbRef.current.start();
            }
          }}
          title={state.publishBtnTitle}
          color="#841584"
        />
      </SafeAreaView>
    </>
  );
};

export default App;
