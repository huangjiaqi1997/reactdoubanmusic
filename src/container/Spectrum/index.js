import React from 'react';
import AudioSpectrum from 'react-audio-spectrum';
/**
 * 问题：音乐能播放，但是没有声音
 * 警告：MediaElementAudioSource outputs zeroes due to CORS access restrictions for 'http....3000'
 * 在audio标签上加上 crossOrigin="anonymous“
 */

const Spectrum = () => (
  <div className="spectrum">
    <AudioSpectrum
      id="audio-canvas"
      height={150}
      width={1000}
      audioId={'audio-element'}
      capColor={'red'}
      capHeight={2}
      meterWidth={2}
      meterCount={512}
      meterColor={[
        {stop: 0, color: '#f00'},
        {stop: 0.5, color: '#0CD7FD'},
        {stop: 1, color: 'red'}
      ]}
      gap={4}
    />
  </div>
)

export default Spectrum;
