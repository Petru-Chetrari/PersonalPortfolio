<script>
    import { onDestroy, onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { listInteractions } from "../lib/api.ts";

    let canvasElement = $state();
    let chartInstance;

    onMount(async () => {
        try {
            const result = await listInteractions({ limit: 30 });
            const interactions = result.data;

            const labels   = interactions.map(i => i.date);
            const projects = interactions.map(i => i.projects);
            const links    = interactions.map(i => i.links);

            if (!canvasElement) return;

            chartInstance = new Chart(canvasElement, {
                type: "line",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Projects",
                            data: projects,
                            borderColor: "#3B82F6",
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
                            data: links,
                            borderColor: "#EAB308",
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
                    plugins: { legend: { display: false } },
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
        } catch (err) {
            console.error('[Chart] Failed to load interactions:', err);
        }
    });

    onDestroy(() => {
        if (chartInstance) chartInstance.destroy();
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

