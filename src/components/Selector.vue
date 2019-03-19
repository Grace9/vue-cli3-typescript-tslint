<template>
	<transition name="slide-up">
		<div class="selector-roll" v-if="isSelector">
			<div class="bg" @click="close"></div>
			<div class="selector-wrap ">
				<section class="hd meta">
					<h2>城市地区选择</h2>
					<a href="javascript:void(0)" class="close"  @click="close"></a>
				</section>
				<section class="hot-city" v-if="hostCiry">
					<h2 class="title meta">热门城市</h2>
					<ul class="list">
						<li :class="[hotCityIndex==index ? 'active' : '']" @click="selectDistrict(item,index)" v-for="(item, index) in hostCiry" :key="index"> {{item.fullName}}</li>
					</ul>
				</section>
				<section class="select-box">
					<h2 class="title meta">省市区选择</h2>
					<div class="select-list">
						<ul class="list-none">
							<li :class="[regionCnScShow ? 'active' : '']" @click="updateProvince()">{{privinceString == '' ? '请选择' : privinceString}}</li>
							<li :class="[cityCnScShow ? 'active' : '']" @click="updateCity()">{{cityString == ''&& privinceString != '' ? '请选择' : cityString}}</li>
							<li :class="[areaCnScShow ? 'active' : '']" @click="updateArea()">{{areaString == ''&& cityString != '' ? '请选择' : areaString}}</li>
						</ul>
					</div>
				</section>
				<section class="content-city">
					<ul class="plist" v-show="regionCnScShow">
						<li :class="provinceIndex == (index)? 'active':''" v-for="(item, index) in regionCnSc" :key="index" class="plistItem" @click="getSelectMess(item,index)"> {{item.fullName}}</li>
					</ul>
					<ul class="plist" v-show="cityCnScShow">
						<li :class="cityIndex == (index)? 'active':''" v-for="(item, index) in cityCnSc" :key="index" class="plistItem" @click="getSelectMess(item,index)"> {{item.fullName}}</li>
					</ul>
					<ul class="plist" v-show="areaCnScShow">
						<li :class="areaIndex == (index)? 'active':''" v-for="(item, index) in areaCnSc" :key="index" class="plistItem" @click="getSelectMess(item,index)"> {{item.fullName}}</li>
					</ul>
				</section>
			</div>
		</div>
	</transition>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
	components: {}
})
export default class Selector extends Vue {
	@Prop() isSelector!: boolean
	@Prop() hostCiry?: Array<object> 
	@Prop() regionCnSc!: Array<object>
	privinceString: string = ''
	cityString: string = ''
	areaString: string = ''
	cityCnSc: any = null
	areaCnSc: any = null
	regionCnScShow: boolean = true
	cityCnScShow: boolean = false
	areaCnScShow: boolean = false
	provinceIndex: any = null
	cityIndex: any = null
	areaIndex: any = null
	hotCityIndex: any = null


	created() {
		console.log('selecor预加载')
	}

	mounted() {
		console.log(this.isSelector)
	}
	close() {
		this.$emit('update:isSelector', false)
	}
	getSelectMess(i,n) {
		console.log(i)
		if(i.level == '2'){
			this.privinceString = i.fullName
			this.cityCnSc = i.city
			this.provinceIndex = n
			this.regionCnScShow = false
			this.cityCnScShow = true
			this.areaCnScShow = false
		}else if(i.level == '3'){
			this.cityString = i.fullName
			this.areaCnSc = i.county
			this.cityIndex =n
			this.regionCnScShow = false
			this.cityCnScShow = false
			this.areaCnScShow = true
			//选择项是热门城市显示红色
			let hostCiryArr = []
			this.hostCiry.forEach((element,index) => {
				hostCiryArr.push(element.fullName)
			});
			if(hostCiryArr.indexOf(this.cityString)!== -1){
				this.hotCityIndex = hostCiryArr.indexOf(this.cityString)
			}else{
				this.hotCityIndex = null
			}
		}else{
			this.areaString = i.fullName
			this.areaIndex = n
			let addressString = this.privinceString + this.cityString + this.areaString
			console.log(addressString)
			this.close()
			this.$emit('updateAddress',addressString)
		}
	}
	updateProvince() {
		this.cityString = ''
		this.areaString = ''
		this.cityIndex = null
		this.areaIndex = null
		this.regionCnScShow = true
		this.cityCnScShow = false
		this.areaCnScShow = false
	}
	updateCity() {
		this.areaString = ''
		this.areaIndex = null
		this.regionCnScShow = false
		this.cityCnScShow = true
		this.areaCnScShow = false
		//切换城市的时候热门城市的变化
		let hostCiryArr = []
		this.hostCiry.forEach((element,index) => {
			hostCiryArr.push(element.fullName)
		});
		if(hostCiryArr.indexOf(this.cityString)!== -1){
			this.hotCityIndex = hostCiryArr.indexOf(this.cityString)
		}else{
			this.hotCityIndex = null
		}
	}
	updateArea() {
		this.regionCnScShow = false
		this.cityCnScShow = false
		this.areaCnScShow = true
	}
	selectDistrict(item,index) {
		this.hotCityIndex = index
		this.privinceString = item.fullNamep
		this.cityString = item.fullName
		this.areaString = ''
		this.areaIndex = null
		this.regionCnSc.forEach((element,index) => {
			if(element.fullName == this.privinceString){
				this.cityCnSc = element.city
				this.provinceIndex = index
				this.cityCnSc.forEach((element,index) => {
					if(element.fullName == this.cityString){
						this.areaCnSc = element.county
						this.cityIndex = index
					}
				});
			}
		});
		this.regionCnScShow = false
		this.cityCnScShow = false
		this.areaCnScShow = true
	}
}
</script>
<style lang="less" scoped>
.selector-roll {
	z-index: 99;
	position: fixed;
	width: 100%;
	min-width: 3.2rem;
	max-width: 7.5rem;
	top: 0;
	bottom: 0;
	.bg {
		position: absolute;
		height: 200%;
		top: -100%;
		right: 0;
		bottom: 0;
		left: 0;
		background: hsla(0, 0%, 95%, 0.7);
	}
}
.selector-wrap {
	box-shadow: 0 0.08rem 0.32rem 0 rgba(0, 0, 0, 0.3);
	position: absolute;
	width: 100%;
	top: auto;
	bottom: 0;
	z-index: 2;
	background: #fff;
	color: #111;
	.hd {
		border-bottom: 1px solid #f1f1f1;
		h2 {
			line-height: 0.48rem;
			font-size: 0.3rem;
			font-weight: 700;
			color: #111;
			padding-left: 0.32rem;
		}
		.close{
			position: absolute;
			top: .32rem;
			right: .48rem;
			z-index: 3;
			width: .4rem;
			height: .4rem;
			border: 0;
			&:after{
				transform: rotate(45deg);
			}
			&:before {
				transform: rotate(-45deg);			
			}
			&:before,&:after {
				content: "";
				display: block;
				position: absolute;
				width: 100%;
				height: 10%;
				top: 50%;
				left: 0;
				border-radius: 20%;
				background: #222;
			}
			
		}
	}
	.select-box{
		border-bottom: 2px solid #f1f1f1;
	}
	.meta {
		padding: 0.32rem 0 0.24rem;
		text-indent: 0.32rem;
	}
	.title {
		line-height: 0.32rem;
		font-size: 0.22rem;
		color: #999;
	}
	.select-list{
		font-size: 0.3rem;
		height: .64rem;
		width: 100%;
		padding: 0 0 0 .64rem;
		box-sizing: border-box;
		ul{
			list-style: none;
			li{
				display: inline-block;
				width: 1.6rem;
				height: .44rem;
				line-height: .44rem;
				font-size: .3rem;
				font-weight: 700;
				color: #333;
				padding-bottom: .2rem;
				margin-right: .48rem;
			}
			li.active{
				color: #dc1e32;
			}
		}
	}
}
.hot-city {
	.list {
		height: 1.64rem;
		padding: 0 0 .04rem .64rem;
	}
	li {
		float: left;
		margin: 0 .32rem .2rem 0;
		width: 1.16rem;
		text-align: center;
		line-height: .6rem;
		border-radius: .3rem;
		background: #f2f2f2;
		font-size: .26rem;
		font-weight: 700;
		color: #111;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		text-indent: 0;
	}
	li.active{
		background: #dc1e32;
		color: #fff;
	}
}
.content-city{
	font-size: 0.3rem;
	height: 5rem;
	overflow-y: scroll;
	.plist{
		z-index: 2;
		width: 100%;
		height: .96rem;
		line-height: .96rem;
		font-size: .3rem;
		font-weight: 700;
		color: #333;
		background: #fff;
		
	}
	li:nth-child(2n+1){
		background: #fcfcfc;
		padding-left: .64rem;
	}
	li:nth-child(2n){
		padding-left: .64rem;
	}
	li.active:after{
		content: "";
		display: block;
		position: absolute;
		top: 50%;
		right: .35rem;
		margin-top: -.2rem;
		width: .11rem;
		height: .22rem;
		border-bottom: 2px solid #dc1e32;
		border-right: 2px solid #dc1e32;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}
	li.active{
		color: #dc1e32;
	}
}



.slide-up-enter-active {
	animation: slide-up 0.4s 0s ease-in-out;
}

.slide-up-leave-active {
	animation: slide-up 0.3s 0s reverse;
}
@keyframes slide-up {
	0% {
		-webkit-transform: translateY(100%);
		transform: translateY(100%);
		opacity: 0;
	}

	to {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}
@keyframes slide-down {
	0% {
		-webkit-transform: translateY(-10%);
		transform: translateY(-10%);
		opacity: 0;
	}

	to {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}
</style>
