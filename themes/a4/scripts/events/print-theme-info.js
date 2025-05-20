/* global hexo */

'use strict'

hexo.on('ready', () => {
  if (!/^(g|s)/.test(hexo.env.cmd)) return
  const { version } = require('../../package.json')
  hexo.log.info(`

Welcome.
----------------------------------------------------------------------
                        _ __               
                        ' )  )              
                        /--'__.  _   _  __ 
                        /   (_/|_/_)_</_/ (_
                                /           
                              '            
----------------------------------------------------------------------
Your hexo-theme-paper version is ${version}. Maybe it can be updated.
Theme extends from hexo-theme-a4, which is a simple and elegant theme.
See a4 theme on github: https://github.com/HiNinoJay/hexo-theme-A4
----------------------------------------------------------------------
`)
})