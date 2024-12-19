$(function () {

    //ページ内スクロール
    var navHeight = $(".header").outerHeight();

    $('a[href^="#"]').on("click", function () {
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? "html" : href);
        var position = target.offset().top - navHeight;
        $("html, body").animate({ scrollTop: position, }, 300, "swing");
        return false;
    });

    //ページトップ
    $("#js-page-top").on("click", function () {
        $("body,html").animate({ scrollTop: 0, }, 300);
        return false;
    });

    var $pageTop = $("#js-page-top"); 
    var showPosition = 300; // 表示させるスクロール位置（px）

    // スクロールイベントの監視
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > showPosition) {
            // 指定のスクロール位置を超えたら表示
            $pageTop.addClass("show");
        } else {
            // 上に戻ったら非表示
            $pageTop.removeClass("show");
        }
    });

    // ページトップクリックでスクロール
    $pageTop.on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 300);
        return false;
    });

    // ページトップのアイコンの重なりチェック
    $(window).on("scroll", function () {
        var footerTop = $(".footer").offset().top; // フッターの位置
        var scrollBottom = $(window).scrollTop() + $(window).height(); // 現在のスクロール位置 + ウィンドウの高さ
        var $pageTop = $("#js-page-top");

        if (scrollBottom > footerTop) {
            // フッターに重なった時
            $pageTop.addClass("is-footer");
        } else {
            // 重なっていない時
            $pageTop.removeClass("is-footer");
        }
    });

    // ハンバーガーメニューの動作
    $("#hamburger-btn").on("click", function () {
        $(this).toggleClass("active"); // ハンバーガーメニューのアニメーション
        $("#nav-menu").toggleClass("open"); // メニューの表示・非表示切り替え
    });


    // AjaxでSTATIC FORMSにデータを送信
    $('#submit').on('click', function (event) {
        // formタグによる送信を拒否
        event.preventDefault();

        // 入力チェックをした結果、エラーがあるかないか判定
        let result = inputCheck();

        // エラー判定とメッセージを取得
        let error = result.error;
        let message = result.message;

        // エラーが無かったらフォームを送信する
        if (error == false) {
            // Ajaxでformを送信する
            $.ajax({
                url: 'https://api.staticforms.xyz/submit',
                type: 'POST',
                dataType: 'json',
                data: $('#form').serialize(),
                success: function (result) {
                    alert('お問い合わせを送信しました。');
                    $('#form')[0].reset();
                    $('#submit').attr('src', 'img/button-submit.png');
                },
                error: function (xhr, resp, text) {
                    alert('お問い合わせを送信できませんでした。')
                }
            })
        } else {
            // エラーメッセージを表示する
            alert(message);
        }
    });

    // フォーカスが外れたとき（blur）にフォームの入力チェックをする
    $('#name').blur(function () {
        inputCheck();
    });
    $('#furigana').blur(function () {
        inputCheck();
    });
    $('#email').blur(function () {
        inputCheck();
    });
    $('#message').blur(function () {
        inputCheck();
    });

    // お問い合わせフォームの入力チェック
    function inputCheck() {
        // エラーのチェック結果
        let result;

        // エラーメッセージのテキスト
        let message = '';

        // エラーがなければfalse、エラーがあればtrue
        let error = false;

        // お名前のチェック
        if ($('#name').val() == '') {
            // エラーあり
            $('#name').css('background-color', '#f79999');
            error = true;
            message += 'お名前を入力してください。\n';
        } else {
            // エラーなし
            $('#name').css('background-color', '#fafafa');
        }

        // フリガナのチェック
        if ($('#furigana').val() == '') {
            // エラーあり
            $('#furigana').css('background-color', '#f79999');
            error = true;
            message += 'フリガナを入力してください。\n';
        } else {
            // エラーなし
            $('#furigana').css('background-color', '#fafafa');
        }

        // お問い合わせのチェック
        if ($('#message').val() == '') {
            // エラーあり
            $('#message').css('background-color', '#f79999');
            error = true;
            message += 'お問い合わせ内容を入力してください。\n';
        } else {
            // エラーなし
            $('#message').css('background-color', '#fafafa');
        }

        // メールアドレスのチェック
        if ($('#email').val() == '' || $('#email').val().indexOf('@') == -1 || $('#email').val().indexOf('.') == -1) {
            // エラーあり
            $('#email').css('background-color', '#f79999');
            error = true;
            message += 'メールアドレスが未記入、または「@」「.」が含まれていません。\n';
        } else {
            // エラーなし
            $('#email').css('background-color', '#fafafa');
        }

        // エラーの有無で送信ボタンを切り替え
        if (error == true) {
            $('#submit').attr('src', 'img/button-submit.png');
        } else {
            $('#submit').attr('src', 'img/button-submit-blue.png');
        }

        // オブジェクトでエラー判定とメッセージを返す
        result = {
            error: error,
            message: message
        }

        // 戻り値としてエラーがあるかどうかを返す
        return result;
    }

    // スクロール時にfade-in要素を表示
    $(window).on("scroll", function () {
        $('.fade-in').each(function () {
        var scrollTop = $(window).scrollTop(); // 現在のスクロール位置
        var windowHeight = $(window).height(); // ウィンドウの高さ
        var offsetTop = $(this).offset().top;  // 要素の位置

        // 要素が画面内に入ったらactiveクラスを追加
        if (scrollTop > offsetTop - windowHeight + 50) {
            $(this).addClass('active');
        }
        });
    });

    // ページ読み込み時にもチェック
    $(window).trigger("scroll");

    // Chart.js レーダーチャートの追加
    
    let skillChartInstance = null; // チャートインスタンス用の変数

    // function renderSkillChart() {
        const canvas = document.getElementById('skillChart');

        // Canvasが存在しない場合は処理をスキップ
        if (!canvas) {
            console.error('Canvas element "skillChart" is not found.');
            return;
        }

        const ctx = canvas.getContext('2d');

        // 既存のチャートインスタンスがあれば破棄
        if (skillChartInstance) {
            console.log('Destroying existing chart instance');
            skillChartInstance.destroy();
            skillChartInstance = null; // 破棄後は null にリセット
        }

        
        // 新しいチャートを作成
        console.log('Creating new chart instance');
        skillChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HTML/CSS', 'JavaScript', 'jQuery', 'Vue.js', 'Laravel', 'PHP'],
                datasets: [{
                    label: 'My Skill Level',
                    data: [5, 4, 4, 3, 4, 4], // スキルレベル
                    backgroundColor: 'rgba(0, 66, 173, 0.2)',
                    borderColor: '#0042AD',
                    borderWidth: 2,
                    pointBackgroundColor: '#001B47',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 5,
                        ticks: {
                            stepSize: 1,
                            display: true, // 数字を表示
                            callback: function(value) { // 数値表示のカスタマイズ
                                return value.toString();
                            },
                            font: {
                                size: 14 // 数字のサイズ
                            },
                            color: '#333' // 数字の色
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 16 // ラベルサイズ調整
                            },
                            color: '#333'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        }),

        // チャート生成をページ読み込み時に1回だけ実行
        $(document).ready(function () {
            if ($('#skillChart').length) {
                console.log('Initializing skill chart');
                renderSkillChart();
            }
        })
        // if ($('#skillChart').length) {
        //         console.log('Initializing skill chart');
        //         renderSkillChart();
        // }




    // });
});
