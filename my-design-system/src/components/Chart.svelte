<script>
    import { onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import { MockRepository } from "../lib/mock-repository.svelte.ts";

    let canvasElement = $state();
    let chartInstance;

    $effect(() => {
        if (!canvasElement) return;

        const agg = MockRepository.getChartAggregations();
        
        if (!chartInstance) {
            chartInstance = new Chart(canvasElement, {
                type: "line",
                data: {
                    labels: agg.labels,
                    datasets: [
                        {
                            label: "Projects",
                            data: agg.projects,
                            borderColor: "#3B82F6", // Blue
                            backgroundColor: "#3B82F6",
                            borderWidth: 3,
                            pointBackgroundColor: "#3B82F6",
                            pointBorderColor: "#0F172A",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4,
                        },
                        {
                            label: "Links",
                            data: agg.links,
                            borderColor: "#EAB308", // Yellow
                            backgroundColor: "#EAB308",
                            borderWidth: 3,
                            pointBackgroundColor: "#EAB308",
                            pointBorderColor: "#0F172A",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 400 },
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#1E293B' },
                            ticks: { color: '#64748B' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#64748B' }
                        }
                    }
                },
            });
        } else {
            chartInstance.data.labels = agg.labels;
            chartInstance.data.datasets[0].data = agg.projects;
            chartInstance.data.datasets[1].data = agg.links;
            chartInstance.update();
        }
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
</script>

<div class="chart-wrapper">
    <canvas bind:this={canvasElement}></canvas>
</div>

<style>
    .chart-wrapper {
        position: relative;
        height: 300px;
        width: 100%;
    }
</style>
