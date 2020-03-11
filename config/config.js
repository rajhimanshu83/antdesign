// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const { pwa, primaryColor } = defaultSettings;
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'en-US', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime', 'netlify-lambda'],
          },
          hardSource: false,
        }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
// if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
// }

export default {
  // add for transfer to umi
  plugins,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/api/v3': {
      target: 'http://localhost:3333/', changeOrigin: true,
      onProxyReq: (ProxyReq, req, res) => {
        console.log('asdsdsd')
        ProxyReq.setHeader("cookie", '_ga=GA1.1.2000755293.1582876574; _gid=GA1.1.2138067538.1582876574; crisp-client%2Fsession%2Fa333748c-62c9-4ec8-a2d3-5a7b5a9c7906=session_e41b223e-9780-4c0a-818a-3d5338fb65cb; mp_bb25aa75ae9d7ccb8d13dafbaedbb151_mixpanel=%7B%22distinct_id%22%3A%20%221708acc712913e-0c4425fed35dcb-b383f66-100200-1708acc712a26d%22%2C%22%24device_id%22%3A%20%221708acc712913e-0c4425fed35dcb-b383f66-100200-1708acc712a26d%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2F127.0.0.1%3A3333%2Flogin%22%2C%22%24initial_referring_domain%22%3A%20%22127.0.0.1%3A3333%22%7D; foodmonk-session=12d43f45e009b397aecbea4c352dd8c7VeF13RGB61e1nVpdpZCRVcWnf%2FVUslO9ybV7TpVIAMwZoSKWs4h%2FM6q4AL29BU4seODlKgn%2FNfsrSVPmDDkGwbQEkF2v%2F7PAVTyadyRb6eE7Khkd9QzwUKAqwgp5Bs9i; XSRF-TOKEN=981c6fef03665941424472d99d2581d3QdlrS1yRCyWif2nHTU0s7RzQ9PCGOi69bXhcRLbHUPBY5t3eiV9VJUrqMK%2FBsA05WfEm34lSlTPkQbj7YgIHpF4Yuo4nkTiklpXYP0iMZ8Las76k4VqqOU1aHMevOG1P; foodmonk-session-values=f0a61da49c56e73e82361b6cdaac7227zpy8A0c9ecQBuLvdovSrtBajpKf%2FeV1Ry%2BUTt6GcubDNtqoCO0FuyGosIV0LPwlJ9HFNLJZARJbQUWDieumFtNi%2F0%2FdTaObA%2Fi7HQ81rezzqqHEHBYGh6y9Ee5Gwgr1aXdWuyxqtNJhgGxsd%2BbaLGmhJAWWDgOFi7N2t1EcKJmmUbzL5%2FzG%2FrdZQ1YNaiOrjBuWELLhSgFGr80h%2BpZqaF09GhiIDcMTnvhZyi%2B%2B0HEFWAQBSlltC00NUYRej1pVf');
      },
      cookieDomainRewrite: ""
    }
  },
  base: '/corporate/',
  publicPath: '/corporate/',
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
