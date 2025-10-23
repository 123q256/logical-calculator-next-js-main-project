import React from 'react'
import ConverterWrap from '../component/ConverterWrap'

const AccelerationAngularConverter = () => {
  return (
    <ConverterWrap>
      <option value="100">Radian/square second</option>
      <option value="360000" >Radian/square minute</option>
      <option value="15.91549431">Revolution/square second</option>
      <option value="954.9296586">Revolution/minute/second</option>
      <option value="57295.77952">Revolution/square minute</option>
    </ConverterWrap>
   
  )
}

export default AccelerationAngularConverter