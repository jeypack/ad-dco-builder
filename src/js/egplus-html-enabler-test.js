//
var egp = window.EGPlus;

function initDCO() {
  // Dynamic Content variables and sample values
  Enabler.setProfileId(10675640);
  /* var devDynamicContent = {};

  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1 = [{}];
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0]._id = 0;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].unique_id = 1;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].start_date = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].start_date.RawValue = "2021-08-01";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].start_date.UtcValue = 1627776000000;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].end_date = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].end_date.RawValue = "2021-12-31";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].end_date.UtcValue = 1640908800000;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].reporting_label = "010821_MCDELIVERY_CHDE_300x600_DEFAULT_BIG_MAC_JUST_EAT_SMOOD_UBER";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].theme = "yellow copy-54";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].anim = "std";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].image_1 = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].image_1.Type = "file";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].image_1.Url = "https://s0.2mdn.net/ads/richmedia/studio/61750/61750_20210817091035966_bigmac-2021-01-300x600.png";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].video_1 = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].video_1.Type = "video";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].video_1.Progressive_Url = "https://gcdn.2mdn.net/videoplayback/id/43a4794232c7627a/itag/18/source/doubleclick/ratebypass/yes/acao/yes/ip/0.0.0.0/ipbits/0/expire/3774538367/sparams/id,itag,source,ratebypass,acao,ip,ipbits,expire/signature/A91A0FDB79C0364886107A3648060FEE6DF10327.7395E9F310C520B42564A12D67DCBAC9D3D5264/key/ck2/file/file.mp4";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].copy_1 = "Lass dir liefern,<br>was du liebst.";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].copy_2 = "";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].delivery = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].delivery.Type = "file";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].delivery.Url = "https://s0.2mdn.net/ads/richmedia/studio/61750/61750_20210817091047556_jeat-smood-uber-01-300x600.png";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].info = "";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].cta = "Jetzt bestellen!";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].css = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].css.Type = "file";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].css.Url = "https://s0.2mdn.net/ads/richmedia/studio/61750/61750_20210827082435336_TPL_DCO_300x600_210817_01.css";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].js = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].js.Type = "file";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].js.Url = "https://s0.2mdn.net/ads/richmedia/studio/61750/61750_20210827082432198_TPL_DCO_300x600_210817_01_ANIM.js";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].repeat_delay = 1.5;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].max_loop = 2;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].exit_url = {};
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].exit_url.Url = "https://www.mcdonalds.com/ch/de-ch/mcdelivery.html";
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].is_default = true;
  devDynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].is_active = true;
  Enabler.setDevDynamicContent(devDynamicContent); */

  var unique_id = dynamicContent.MC_DELIVERY_CH_DE_DCO_FEED_300X600_01_Sheet1[0].unique_id;
  console.log("unique_id:", unique_id);
}

egp.on('init', function () {
  console.log('EGPlus on init');
  var ad = egp.ad;
  // handle 'clickThrough'
  egp.on('clickThrough', function (e) {
    console.log("ExitURL:", ad.ExitURL);
    Enabler.exitOverride('Background Exit', ad.ExitURL);
  });
  if (Enabler.isInitialized()) {
    initDCO();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, initDCO);
  }
});
