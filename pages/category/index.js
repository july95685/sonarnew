const { getBrandList, getAccountList, getIndustryList } = require('../../service');

let hasSelected = []

Page({
    data:{
        currentTab: 0,
        industryList: [],
        brandList: [],
        accountList: [],

        isLoadingBrand: true,
        isLoadingAccount: true,

        hasMoreAccount: true,
        hasMoreBrand: true,

        isLoadingIndustry: true
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载

        this.currentBrandPage = 0
        this.currentAccountPage = 0

        getIndustryList({
            params:{
                limit: 100,
                skip:0
            },
            success: (data)=>{
                this.setData({
                    industryList: data.map((v)=>{
                        return {
                            id: v._id,
                            logo: v.logo,
                            name: v.name
                        }
                    })
                })
            },
            complete: ()=>{
                this.setData({
                    isLoadingIndustry: false
                })
            }
        })

    

    },
    switchTab: function(ev){
        let {key} = ev.currentTarget.dataset
        if(hasSelected.indexOf(key) == -1){
            key == 1 && this.loadBrandList(this.currentBrandPage)
            key == 2 && this.loadAccountList(this.currentAccountPage)
            hasSelected.push(key)   
        }
        
        this.setData({
            currentTab: key
        })
    },
    onShareAppMessage: function() {
        return {
            title: 'Brandtail',
            path: '/pages/index/index',
            success: function () {
            wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 2000
            })
            }
        }
    },


    loadBrandList(page){
        
            let that = this;
            let {brandList} = this.data;
        
            that.setData({
              isLoadingBrand: true
            })
        
            getBrandList({
                params:{
                   limit:30,
                   skip: page*30 
                },
                success: (data)=>{
                    let newBrandList = data.map((v)=>{
                        return {
                            id: v.id || v._id,
                            logo: v.logo.path,
                            name: v.chineseName
                        }
                    })
                    brandList = brandList.concat(newBrandList)
                    that.currentBrandPage = page


                    that.setData({
                        brandList,
                        hasMoreBrand: newBrandList.length == 30
                    })
                },
                complete: function() {
                    that.setData({
                        isLoadingBrand: false
                    })
                }
            })
    },


    loadAccountList(page){
        
            let that = this;
            let {accountList} = this.data;
        
            that.setData({
              isLoadingAccount: true
            })
        
            getAccountList({
                params:{
                   limit:30,
                   skip: page*30 
                },
                success: (data)=>{
                    
                    let newAccountList = data.map((v)=>{
                        return {
                            id: v.id || v._id,
                            logo: v.logo.path,
                            name: v.name
                        }
                    })

                    accountList = accountList.concat(newAccountList)
                    that.currentAccountPage = page

                    that.setData({
                        accountList,
                        hasMoreAccount: newAccountList.length == 30
                    })
                },
                complete: function() {
                    that.setData({
                        isLoadingAccount: false
                    })
                }
            })
    },

    brandOnReachBottom(){
        let {hasMoreBrand, isLoadingBrand} = this.data;
        if (!hasMoreBrand || isLoadingBrand) return;
        this.loadBrandList(this.currentBrandPage + 1);
    },

    accountOnReachBottom(){
        let {hasMoreAccount, isLoadingAccount} = this.data;
        if (!hasMoreAccount || isLoadingAccount) return;
        this.loadAccountList(this.currentAccountPage + 1);
    },

    enterDetail(ev){
        let {type, id, title} = ev.currentTarget.dataset
        wx.navigateTo({
            url: `../list/index?type=${type}&id=${id}&title=${title}`
        })
    }

})