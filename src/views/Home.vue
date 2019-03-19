<template>
	<div>
		<div class="edit-from">
			<div class="selecor-input" :placeholder.sync="placeholder" @click="checkSeleor" ></div>
		</div>
		<Selector :isSelector.sync="isSelector" @updateAddress="isAddress" :hostCiry="hostCityData" :regionCnSc="regionCnScData" ></Selector>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Selector from '@/components/Selector.vue'
import axios from 'axios'
import { jsonp } from '../assets/scripts/common/util'

interface RegionCnSc {
	obj: any,
	version: string
}


@Component({
	components: {
		Selector
	}
})
export default class Home extends Vue {
	isSelector: boolean = false
	placeholder: string ='城市 / 区域'
	hostCityData: any = null
	regionCnScData: any = null
	regionCnScVersion: string = ''
	async checkSeleor() {
		try {
			await this.getData()
		} catch(e) {
			console.error(e)
			return false
		}
		this.isSelector = true	
	}
	isAddress(data){
		this.placeholder = data
	}
	getData():  Promise<{}> {				
		return new Promise((resolve, reject) => {
			//是否已缓存数据状态
			let isLocalExist :boolean = false
			const jvHostcityJSONStr: string|null = localStorage.getItem('jv_hostcity')
			const jvRegionCnScJSONStr: string|null = localStorage.getItem('jv_region_cn_sc')
			let localHostCityData: object = {}
			let localRegionCnSc: object = {}
			let localRegionCnScVersion: string = ''
			if (jvHostcityJSONStr && jvRegionCnScJSONStr){
				isLocalExist = true
				try {
					localHostCityData = JSON.parse(jvHostcityJSONStr)				
					localRegionCnSc = JSON.parse(jvRegionCnScJSONStr).obj
					localRegionCnScVersion = JSON.parse(jvRegionCnScJSONStr).version
				} catch(e) {
					isLocalExist = false
					console.log(e)
				}
			}			
			if (isLocalExist) {
				// 已缓存数据赋值
				this.hostCityData = localHostCityData
				this.regionCnScData = localRegionCnSc
				this.regionCnScVersion = localRegionCnScVersion		
				resolve()			
			} else {
				// 无数据设置缓存(文件格式一致json和jsonp)
				const getHotcity = axios.get('/data/addr/hotcity.json')
				const getRegionCnSc = jsonp('/data/addr/region-cn-sc.json','local_region_cn_sc')				
				Promise.all([getHotcity, getRegionCnSc]).then(data => {
					const [hostCity, regionCnSc] = data
					if (hostCity.status === 200 ){				
						this.hostCityData = hostCity.data
						localStorage.setItem('jv_hostcity', JSON.stringify(hostCity.data))
					}			
					localStorage.setItem('jv_region_cn_sc', JSON.stringify(regionCnSc))
					//typescript类型断言
					this.regionCnScData = (regionCnSc as RegionCnSc).obj
					this.regionCnScVersion = (regionCnSc as RegionCnSc).version		
					resolve()
				}).catch(e => {
					reject(e)
				})
			}
		})
	}
}
</script>

<style lang="less" scoped>
.edit-from{
	padding: .4rem .64rem .72rem;
	background: #fff;
	box-shadow: 0 -0.08rem 0.8rem 0.08rem rgba(0,0,0,.08);
}
.selecor-input{
	text-align: left;
	font-size: .3rem;
	border-bottom: 1px solid #f1f1f1;
	height: 0.8rem;
	line-height: 0.8rem;
	&:after {
		content: "";
		position: absolute;
		width: .2rem;
		height: .2rem;
		top: 105%;
		right:3%;
		border-top: 0.02rem solid #999;
		border-left: 0.02rem solid #999;
		margin-top: -0.48rem;
		-webkit-transform: rotate(135deg);
		transform: rotate(135deg);
		color: #9b9b9b;
	}
}
[placeholder]:empty:before {
	content: attr(placeholder);
	color: #9b9b9b
}
</style>

